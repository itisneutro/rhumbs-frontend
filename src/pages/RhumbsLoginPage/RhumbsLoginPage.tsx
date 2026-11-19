import axios from 'axios'
import { useState, type FC, type FormEvent, type MouseEvent } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RhumbsBackdrop } from '../../components/RhumbsBackdrop/RhumbsBackdrop'
import { RhumbsCompass } from '../../components/RhumbsCompass/RhumbsCompass'
import { RhumbsWind } from '../../components/RhumbsWind/RhumbsWind'
import type { AppDispatch } from '../../rhumbsStore'
import { RHUMBS_ROUTES } from '../../RhumbsRoutes'
import { setRhumbsUser } from '../../slices/rhumbsUsersSlice'

const RHUMBS_TILT_MAX = 5
const RHUMBS_TILT_PROPERTIES = [
  '--rhumbs-tilt-x',
  '--rhumbs-tilt-y',
  '--rhumbs-glare-x',
  '--rhumbs-glare-y',
]

const tiltRhumbsForm = (event: MouseEvent<HTMLFormElement>) => {
  const rhumbsForm = event.currentTarget
  const rhumbsRect = rhumbsForm.getBoundingClientRect()
  const rhumbsX = (event.clientX - rhumbsRect.left) / rhumbsRect.width
  const rhumbsY = (event.clientY - rhumbsRect.top) / rhumbsRect.height

  rhumbsForm.style.setProperty('--rhumbs-tilt-x', `${(0.5 - rhumbsY) * 2 * RHUMBS_TILT_MAX}deg`)
  rhumbsForm.style.setProperty('--rhumbs-tilt-y', `${(rhumbsX - 0.5) * 2 * RHUMBS_TILT_MAX}deg`)
  rhumbsForm.style.setProperty('--rhumbs-glare-x', `${rhumbsX * 100}%`)
  rhumbsForm.style.setProperty('--rhumbs-glare-y', `${rhumbsY * 100}%`)
}

const resetRhumbsForm = (event: MouseEvent<HTMLFormElement>) => {
  for (const rhumbsProperty of RHUMBS_TILT_PROPERTIES) {
    event.currentTarget.style.removeProperty(rhumbsProperty)
  }
}

export const RhumbsLoginPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [rhumbsLogin, setRhumbsLogin] = useState('')
  const [rhumbsPassword, setRhumbsPassword] = useState('')
  const [rhumbsLoginFailed, setRhumbsLoginFailed] = useState(false)
  const [rhumbsLoginPending, setRhumbsLoginPending] = useState(false)

  const loginRhumbsUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setRhumbsLoginFailed(false)
    setRhumbsLoginPending(true)

    try {
      const rhumbsResponse = await axios.post<{ login: string }>('/api/users/login', {
        login: rhumbsLogin,
        password: rhumbsPassword,
      })
      dispatch(setRhumbsUser(rhumbsResponse.data.login))
      navigate(RHUMBS_ROUTES.RHUMBS)
    } catch {
      setRhumbsLoginFailed(true)
    } finally {
      setRhumbsLoginPending(false)
    }
  }

  return (
    <>
      <RhumbsBackdrop />
      <div className="rhumbs-login__rose" aria-hidden="true">
        <RhumbsCompass className="rhumbs-rose--login" geoAzimuth={0} magAzimuth={0} />
      </div>
      <RhumbsWind />
      <div className="rhumbs-login">
        <h1 className="rhumbs-draft__title">Вход</h1>
        <Form
          className={
            rhumbsLoginFailed
              ? 'rhumbs-draft__form rhumbs-draft__form--invalid'
              : 'rhumbs-draft__form'
          }
          onSubmit={loginRhumbsUser}
          onMouseMove={tiltRhumbsForm}
          onMouseLeave={resetRhumbsForm}
        >
          <Form.Label bsPrefix="rhumbs-draft__label" htmlFor="rhumbs-login">
            Логин
          </Form.Label>
          <Form.Control
            bsPrefix="rhumbs-draft__input"
            id="rhumbs-login"
            type="text"
            value={rhumbsLogin}
            isInvalid={rhumbsLoginFailed}
            onChange={(event) => {
              setRhumbsLogin(event.target.value)
              setRhumbsLoginFailed(false)
            }}
          />
          <Form.Label bsPrefix="rhumbs-draft__label" htmlFor="rhumbs-password">
            Пароль
          </Form.Label>
          <Form.Control
            bsPrefix="rhumbs-draft__input"
            id="rhumbs-password"
            type="password"
            value={rhumbsPassword}
            isInvalid={rhumbsLoginFailed}
            onChange={(event) => {
              setRhumbsPassword(event.target.value)
              setRhumbsLoginFailed(false)
            }}
          />
          <Button
            type="submit"
            bsPrefix="rhumbs-button"
            variant=""
            className="rhumbs-draft__submit"
            disabled={rhumbsLoginPending}
          >
            Войти
          </Button>
        </Form>
      </div>
    </>
  )
}
