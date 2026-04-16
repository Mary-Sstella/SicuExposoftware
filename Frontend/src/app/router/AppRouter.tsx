import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from '../../shared/constants/routes'
import LoginPage from '../../features/auth/pages/LoginPage'

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path="*" element={<Navigate to={ROUTES.LOGIN} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter