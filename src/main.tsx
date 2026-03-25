import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ToastWrapper } from "./context/toast.context.tsx"

createRoot(document.getElementById('root')!).render(
  <ToastWrapper>
      <BrowserRouter>
          <App />
      </BrowserRouter>
  </ToastWrapper>
)
