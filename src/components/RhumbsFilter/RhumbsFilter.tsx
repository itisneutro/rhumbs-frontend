import type { FC } from 'react'
import { Button, Form } from 'react-bootstrap'

type RhumbsFilterProps = {
  minAzimuth: number
  setMinAzimuth: (minAzimuth: number) => void
  onSubmit: () => void
  disabled: boolean
}

export const RhumbsFilter: FC<RhumbsFilterProps> = ({
  minAzimuth,
  setMinAzimuth,
  onSubmit,
  disabled,
}) => (
  <Form
    className="rhumbs-tiles__filter"
    onSubmit={(event) => {
      event.preventDefault()
      onSubmit()
    }}
  >
    <Form.Label bsPrefix="rhumbs-tiles__filter-label" htmlFor="rhumbsMinAzimuth">
      Азимут от
    </Form.Label>
    <Form.Range
      bsPrefix="rhumbs-tiles__filter-range"
      id="rhumbsMinAzimuth"
      min={0}
      max={315}
      step={45}
      value={minAzimuth}
      onChange={(event) => setMinAzimuth(Number(event.target.value))}
    />
    <span className="rhumbs-tiles__filter-value">{`${minAzimuth}°`}</span>
    <Button
      type="submit"
      bsPrefix="rhumbs-button"
      variant=""
      className="rhumbs-button--small rhumbs-tiles__filter-button"
      disabled={disabled}
    >
      Найти
    </Button>
  </Form>
)
