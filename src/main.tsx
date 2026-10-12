import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/rhumbs.css'
import RhumbsApp from './RhumbsApp.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RhumbsApp />
  </StrictMode>,
)
