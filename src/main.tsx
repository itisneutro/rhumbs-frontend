import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/rhumbs.css'
import RhumbsApp from './RhumbsApp.tsx'
import { rhumbsStore } from './rhumbsStore'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={rhumbsStore}>
      <RhumbsApp />
    </Provider>
  </StrictMode>,
)
