
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
import InscripcionPage from '../../features/inscripcion/pages/InscripcionPage'
import SolicitudesPage from '../../features/solicitudes/pages/SolicitudesPage'
import BilleteraPage from '../../features/billetera/pages/BilleteraPage'
import ConfiguracionPage from '../../features/configuracion/pages/ConfiguracionPage'
import CarteraPage from '../../features/cartera/pages/CarteraPage'
import ResenasPage from '../../features/resenas/pages/ResenasPage'
import ResenasEstudiantePage from '../../features/resenas/pages/ResenasEstudiantePage'
import TurneroPage from '../../features/turnero/pages/TurneroPage'





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
          <Route path={ROUTES.SOLICITUDES} element={<SolicitudesPage />} />
          <Route path={ROUTES.CARTERA} element={<CarteraPage />} />
          <Route path={ROUTES.CONFIGURACION} element={<ConfiguracionPage />} />
          <Route path={ROUTES.BUZON} element={<ResenasPage />} />
        </Route>
        <Route element={<StudentLayout />}>
        <Route path={ROUTES.STUDENT} element={<EstudiantePage />} />
        <Route path={ROUTES.STUDENT_PAGO} element={<BilleteraPage />} />
        <Route path={ROUTES.STUDENT_RESENAS} element={<ResenasEstudiantePage />} />
        </Route>
        <Route path={ROUTES.TURNERO} element={<TurneroPage />} />
        <Route path="*" element={<Navigate to={ROUTES.LOGIN} />} />
        
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter