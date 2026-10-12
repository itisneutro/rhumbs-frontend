import type { FC } from 'react'
import { Button, Form } from 'react-bootstrap'
import './RhumbsFilter.css'

type RhumbsFilterProps = {
  value: number | undefined
  setValue: (value: number | undefined) => void
  onSubmit: () => void
}

// Фильтр по минимальному географическому азимуту; пустое поле — все румбы
export const RhumbsFilter: FC<RhumbsFilterProps> = ({ value, setValue, onSubmit }) => (
  <Form
    className="rhumbsFilter"
    onSubmit={(event) => {
      event.preventDefault()
      onSubmit()
    }}
  >
    <Form.Group className="rhumbsFilterGroup" controlId="rhumbsMinAzimuth">
      <Form.Label className="rhumbsFilterLabel">Мин. азимут, °</Form.Label>
      <Form.Control
        className="rhumbsFilterInput"
        type="number"
        min={0}
        max={359}
        step={1}
        value={value ?? ''}
        onChange={(event) =>
          setValue(event.target.value === '' ? undefined : Number(event.target.value))
        }
      />
    </Form.Group>
    <Button type="submit" className="rhumbsButton">
      Найти
    </Button>
  </Form>
)
