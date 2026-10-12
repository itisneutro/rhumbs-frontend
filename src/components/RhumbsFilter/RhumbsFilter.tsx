import type { FC } from 'react'
import { Button, Form } from 'react-bootstrap'
import './RhumbsFilter.css'

type RhumbsFilterProps = {
  value: number | undefined
  setValue: (value: number | undefined) => void
  onSubmit: () => void
}

// Фильтр по минимальному географическому азимуту
export const RhumbsFilter: FC<RhumbsFilterProps> = ({ value, setValue, onSubmit }) => (
  <Form
    className="rhumbs-tiles__filter"
    onSubmit={(event) => {
      event.preventDefault()
      onSubmit()
    }}
  >
    <Form.Label className="rhumbs-tiles__filter-label" htmlFor="rhumbsMinAzimuth">
      Азимут от
    </Form.Label>
    <Form.Range
      className="rhumbs-tiles__filter-range"
      id="rhumbsMinAzimuth"
      min={0}
      max={315}
      step={45}
      value={value ?? 0}
      onChange={(event) => setValue(Number(event.target.value))}
    />
    <span className="rhumbs-tiles__filter-degrees">{value ?? 0}°</span>
    <Button type="submit" className="rhumbs-button rhumbs-button--small rhumbs-tiles__filter-button">
      Найти
    </Button>
  </Form>
)
