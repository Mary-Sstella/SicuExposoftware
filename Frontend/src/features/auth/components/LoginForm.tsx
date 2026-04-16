import { useState } from "react"
//import { useNavigate } from "react-router-dom"
import { loginUsuario } from "../services/authService"

function LoginForm() {
  const [isStudent, setIsStudent] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showStudentPassword, setShowStudentPassword] = useState(false)

  // Admin
  const [adminUser, setAdminUser] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [adminError, setAdminError] = useState('')
  const [adminLoading, setAdminLoading] = useState(false)

  // Estudiante
  const [studentUser, setStudentUser] = useState('')
  const [studentPassword, setStudentPassword] = useState('')
  const [studentError, setStudentError] = useState('')
  const [studentLoading, setStudentLoading] = useState(false)

  //const navigate = useNavigate()

  const handleAdminLogin = async () => {
    setAdminError('')
    setAdminLoading(true)
    try {
      const data = await loginUsuario({ credencial: adminUser, password: adminPassword })
      localStorage.setItem('token', data.token)
      localStorage.setItem('rol', data.rol)
      // navigate('/admin/dashboard')  ← descomenta cuando tengas la ruta
    } catch {
      setAdminError('Usuario o contraseña incorrectos')
    } finally {
      setAdminLoading(false)
    }
  }

  const handleStudentLogin = async () => {
    setStudentError('')
    setStudentLoading(true)
    try {
      const data = await loginUsuario({ credencial: studentUser, password: studentPassword })
      localStorage.setItem('token', data.token) 
      localStorage.setItem('rol', data.rol) 
      // navigate('/estudiante/dashboard')  ← descomenta cuando tengas la ruta
    } catch {
      setStudentError('Usuario o contraseña incorrectos')
    } finally {
      setStudentLoading(false)
    }
  }

  return (
    <div className="flex w-full rounded-2xl shadow-2xl overflow-hidden bg-white relative" style={{ minHeight: '520px' }}>

      {/* Panel admin */}
      <div className="w-1/2 p-10 flex flex-col justify-center gap-4 z-10">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 mx-auto shadow-lg" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800 text-center">Bienvenido de Vuelta</h2>
          <p className="text-gray-400 text-sm mt-1 text-center">Accede al panel administrativo</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Usuario</label>
          <input
            type="text"
            value={adminUser}
            onChange={e => setAdminUser(e.target.value)} //se usa el estado para actualizar el valor del input
            placeholder="ejemplo@unicesar.edu.co"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Contraseña</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={adminPassword}
              onChange={e => setAdminPassword(e.target.value)}
              placeholder="••••••"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-400 text-xs hover:text-purple-500 transition">
              {showPassword ? 'Ocultar' : 'Ver'}
            </button>
          </div>
        </div>

        {adminError && <p className="text-red-400 text-xs text-center">{adminError}</p>}

        <button type="button" onClick={handleAdminLogin} disabled={adminLoading}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-400 text-white py-2.5 rounded-xl font-semibold hover:opacity-90 transition shadow-md disabled:opacity-60">
          {adminLoading ? 'Iniciando...' : 'Iniciar sesión'}
        </button>

        <p className="text-center text-sm text-gray-400">
          ¿Eres estudiante?{' '}
          <button type="button" onClick={() => setIsStudent(true)}
            className="text-purple-500 font-semibold hover:underline">
            Ingresa aquí
          </button>
        </p>
      </div>

      {/* Panel estudiante */}
      <div className="w-1/2 p-10 flex flex-col justify-center gap-4 z-10">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 mx-auto shadow-lg" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800 text-center">Portal Estudiantil</h2>
          <p className="text-gray-400 text-sm mt-1 text-center">Accede con tus credenciales</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Usuario o Correo</label>
          <input
            type="text"
            value={studentUser}
            onChange={e => setStudentUser(e.target.value)}
            placeholder="Usuario"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Contraseña</label>
          <div className="relative">
            <input
              type={showStudentPassword ? 'text' : 'password'}
              value={studentPassword}
              onChange={e => setStudentPassword(e.target.value)}
              placeholder="••••••"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50"
            />
            <button type="button" onClick={() => setShowStudentPassword(!showStudentPassword)}
              className="absolute right-3 top-2.5 text-gray-400 text-xs hover:text-purple-500 transition">
              {showStudentPassword ? 'Ocultar' : 'Ver'}
            </button>
          </div>
        </div>

        {studentError && <p className="text-red-400 text-xs text-center">{studentError}</p>}

        <button type="button" onClick={handleStudentLogin} disabled={studentLoading}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-400 text-white py-2.5 rounded-xl font-semibold hover:opacity-90 transition shadow-md disabled:opacity-60">
          {studentLoading ? 'Iniciando...' : 'Iniciar sesión'}
        </button>

        <p className="text-center text-sm text-gray-400">
          ¿Eres administrador?{' '}
          <button type="button" onClick={() => setIsStudent(false)}
            className="text-purple-500 font-semibold hover:underline">
            Ingresa aquí
          </button>
        </p>
      </div>

      {/* Panel morado deslizante */}
      <div
        className="absolute inset-y-0 w-1/2 bg-gradient-to-br from-purple-600 via-purple-500 to-pink-400 flex flex-col justify-between p-10 rounded-3xl transition-all duration-700 ease-in-out z-20"
        style={{ left: isStudent ? '0%' : '50%' }}
      >
        <div className="absolute top-10 right-10 w-24 h-24 rounded-full bg-white/10" />
        <div className="absolute top-20 right-20 w-12 h-12 rounded-full bg-white/10" />
        <div className="absolute bottom-16 left-8 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute bottom-8 left-16 w-16 h-16 rounded-full bg-pink-300/20" />

        <div className="relative z-10 mt-10">
          <h2 className="text-white text-3xl font-bold leading-tight">
            {isStudent ? 'Hola,\nBienvenido' : 'Panel\nAdministrativo'}
          </h2>
          <p className="text-white/70 text-sm mt-3">
            {isStudent
              ? 'Gestiona tu almuerzo y muchos mas desde tu portal estudiantil'
              : 'Gestiona el comedor universitario desde un solo lugar'}
          </p>
        </div>

        <p className="text-white/40 text-xs relative z-10">Universidad Popular del Cesar</p>
      </div>

    </div>
  )
}

export default LoginForm