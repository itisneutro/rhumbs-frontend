import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { generateApi } from 'swagger-typescript-api'
import ts from 'typescript'

const rhumbsApiOutput = resolve(process.cwd(), './src/api')
const rhumbsApiFile = resolve(rhumbsApiOutput, 'Api.ts')

await generateApi({
  fileName: 'Api.ts',
  output: rhumbsApiOutput,
  url: 'http://localhost:3000/api/docs-json',
  httpClientType: 'axios',
  enumStyle: 'const',
  moduleNameFirstTag: true,
  hooks: {
    onCreateRoute: (rhumbsRoute) => (rhumbsRoute.raw.tags?.[0] === 'users' ? false : rhumbsRoute),
  },
})

const getRhumbsComments = (rhumbsText) => {
  const rhumbsSource = ts.createSourceFile(rhumbsApiFile, rhumbsText, ts.ScriptTarget.Latest, true)
  const rhumbsComments = new Map()

  const collectRhumbsComments = (rhumbsNode) => {
    if (
      rhumbsNode.kind >= ts.SyntaxKind.FirstJSDocNode &&
      rhumbsNode.kind <= ts.SyntaxKind.LastJSDocNode
    ) {
      return
    }

    const rhumbsRanges = [
      ...(ts.getLeadingCommentRanges(rhumbsText, rhumbsNode.getFullStart()) ?? []),
      ...(ts.getTrailingCommentRanges(rhumbsText, rhumbsNode.getEnd()) ?? []),
    ]
    rhumbsRanges.forEach((rhumbsRange) => rhumbsComments.set(rhumbsRange.pos, rhumbsRange))
    rhumbsNode.getChildren(rhumbsSource).forEach(collectRhumbsComments)
  }

  collectRhumbsComments(rhumbsSource)

  return [...rhumbsComments.values()].sort(
    (leftRange, rightRange) => rightRange.pos - leftRange.pos,
  )
}

const removeRhumbsComments = (rhumbsText) => {
  let rhumbsClean = rhumbsText
  let rhumbsBoundary = rhumbsText.length

  for (const { pos, end } of getRhumbsComments(rhumbsText)) {
    if (end > rhumbsBoundary) {
      continue
    }

    const rhumbsLineStart = rhumbsClean.lastIndexOf('\n', pos - 1) + 1
    const rhumbsLineBreak = rhumbsClean.indexOf('\n', end)
    const rhumbsLineEnd = rhumbsLineBreak === -1 ? rhumbsClean.length : rhumbsLineBreak
    const rhumbsCodeBefore = rhumbsClean.slice(rhumbsLineStart, pos).trim() !== ''
    const rhumbsCodeAfter = rhumbsClean.slice(end, rhumbsLineEnd).trim() !== ''

    if (!rhumbsCodeBefore && !rhumbsCodeAfter) {
      rhumbsClean = rhumbsClean.slice(0, rhumbsLineStart) + rhumbsClean.slice(rhumbsLineEnd + 1)
    } else {
      const rhumbsHead = rhumbsCodeBefore
        ? rhumbsClean.slice(0, pos).replace(/[ \t]+$/, '')
        : rhumbsClean.slice(0, pos)
      const rhumbsGap = rhumbsCodeBefore && rhumbsCodeAfter ? ' ' : ''

      rhumbsClean = rhumbsHead + rhumbsGap + rhumbsClean.slice(end).replace(/^[ \t]+/, '')
    }

    rhumbsBoundary = pos
  }

  const rhumbsLines = []

  for (const rhumbsLine of rhumbsClean.split('\n')) {
    const rhumbsBlank = rhumbsLine.trim() === ''
    const rhumbsPreviousBlank = rhumbsLines.length === 0 || rhumbsLines.at(-1).trim() === ''

    if (!(rhumbsBlank && rhumbsPreviousBlank)) {
      rhumbsLines.push(rhumbsLine)
    }
  }

  return rhumbsLines.join('\n')
}

await writeFile(rhumbsApiFile, removeRhumbsComments(await readFile(rhumbsApiFile, 'utf8')))
