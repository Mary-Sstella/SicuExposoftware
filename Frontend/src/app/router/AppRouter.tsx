
//define las rutas del sistema 
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from '../../shared/constants/routes'
import LoginPage from '../../features/auth/pages/LoginPage'
import MainLayout from '../../shared/components/layout/MainLayout'
import DashboardPage from '../../features/dashboard/pages/DashboardPage'
import EstudiantesPage from '../../features/estudiantes/pages/EstudiantesPage'
import AsistenciaPage from '../../features/asistencia/pages/AsistenciaPage'
import TurnosPage from '../../features/turnos/pages/TurnosPage'
import StudentLayout from '../../shared/components/layout/StudentLayout'
import EstudiantePage from '../../features/student/pages/EstudiantePage'
import LandingPage from '../../features/landing/pages/LandingPage'
import EstadisticasPage from '../../features/estadisticas/pages/EstadisticasPage'
import InscripcionPage from '../../features/inscripcion/InscripcionPage'


function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.INSCRIPCION} element={<InscripcionPage />} />

        <Route element={<MainLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.ESTUDIANTES} element={<EstudiantesPage />} />
          <Route path={ROUTES.ASISTENCIA} element={<AsistenciaPage />} />
          <Route path={ROUTES.TURNOS} element={<TurnosPage/>}/>
          <Route path={ROUTES.ESTADISTICAS} element={<EstadisticasPage />} />
        </Route>
        <Route element={<StudentLayout />}>
        <Route path={ROUTES.STUDENT} element={<EstudiantePage />} />
        </Route>
        <Route path="*" element={<Navigate to={ROUTES.LOGIN} />} />
        
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter