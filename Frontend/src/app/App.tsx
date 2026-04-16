import AppRouter from './router/AppRouter'

interface Estudiante {
  id_estudiante: number;
  numero_identificacion: string;
  tipo_identificacion: string;
  nombres: string;
  apellidos: string;
  correo_personal: string;
  correo_institucional: string;
  programa: string;
  estado: string;
  contador_inasistencias: number;
  limite_inasistencias: number;
  fecha_registro: string;
}

function App() {
  return <AppRouter />
}

export default App

{/*renderizar el router*/}
