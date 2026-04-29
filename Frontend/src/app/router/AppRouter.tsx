import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from '../../shared/constants/routes'
import LoginPage from '../../features/auth/pages/LoginPage'
import MainLayout from '../../shared/components/layout/MainLayout'
import DashboardPage from '../../features/dashboard/pages/DashboardPage'
import EstudiantesPage from '../../features/estudiantes/pages/EstudiantesPage'
import AsistenciaPage from '../../features/asistencia/pages/AsistenciaPage'


function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />

        <Route element={<MainLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.ESTUDIANTES} element={<EstudiantesPage />} />
          <Route path={ROUTES.ASISTENCIA} element={<AsistenciaPage />} />
        </Route>
        <Route path="*" element={<Navigate to={ROUTES.LOGIN} />} />
        
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter