import axios from 'axios'
import { useState, type FC, type FormEvent } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import type { AppDispatch } from '../../rhumbsStore'
import { RHUMBS_ROUTES } from '../../RhumbsRoutes'
import { setRhumbsUser } from '../../slices/rhumbsUsersSlice'

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
      <h1 className="rhumbs-draft__title">Вход</h1>
      <Form className="rhumbs-draft__form" onSubmit={loginRhumbsUser}>
        <Form.Label bsPrefix="rhumbs-draft__label" htmlFor="rhumbs-login">
          Логин
        </Form.Label>
        <Form.Control
          bsPrefix="rhumbs-draft__input"
          id="rhumbs-login"
          type="text"
          value={rhumbsLogin}
          isInvalid={rhumbsLoginFailed}
          onChange={(event) => setRhumbsLogin(event.target.value)}
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
          onChange={(event) => setRhumbsPassword(event.target.value)}
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
    </>
  )
}
