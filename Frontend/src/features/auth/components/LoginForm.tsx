import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { Mail, Lock, Eye, EyeOff, LogIn, GraduationCap, ArrowLeft } from 'lucide-react'

function LoginForm() {
  const navigate = useNavigate()
  const [isStudent, setIsStudent] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showStudentPassword, setShowStudentPassword] = useState(false)

  const {
    adminUser, setAdminUser,
    adminPassword, setAdminPassword,
    adminError, setAdminError, adminLoading, handleAdminLogin,
    studentUser, setStudentUser,
    studentPassword, setStudentPassword,
    studentError, setStudentError, studentLoading, handleStudentLogin,
  } = useAuth()

  return (
    <div className="flex flex-col md:flex-row w-full rounded-2xl shadow-2xl overflow-hidden bg-white relative" style={{ minHeight: '560px' }}>

      {/* Botón volver al landing */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-violet-600 hover:bg-violet-50 transition"
      >
        <ArrowLeft size={14} /> Volver
      </button>

      {/* Panel admin */}
      <div className={`w-full md:w-1/2 p-6 md:p-10 flex-col justify-center gap-4 z-10 ${isStudent ? 'hidden md:flex' : 'flex'}`}>
        <div className="w-11 h-11 rounded-2xl bg-violet-500 mx-auto shadow-md flex items-center justify-center">
          <span className="text-white font-black text-xl">S</span>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Bienvenido de Vuelta</h2>
          <p className="text-gray-400 text-sm mt-1">Accede al panel administrativo</p>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Correo</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-400" />
            <input
              type="email"
              value={adminUser}
              onChange={e => setAdminUser(e.target.value)}
              placeholder="Ingrese su Correo"
              className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Contraseña</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={adminPassword}
              onChange={e => setAdminPassword(e.target.value)}
              placeholder="••••••••••"
              className="w-full border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-violet-500 transition">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {adminError && <p className="text-red-400 text-xs text-center">{adminError}</p>}

        <button type="button" onClick={handleAdminLogin} disabled={adminLoading}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2.5 rounded-xl font-semibold transition shadow-sm disabled:opacity-60 flex items-center justify-center gap-2">
          <LogIn size={17} />
          {adminLoading ? 'Iniciando...' : 'Iniciar sesión'}
        </button>

        <div className="flex items-center gap-3">
          <hr className="flex-1 border-gray-200" />
          <span className="text-xs text-gray-400">ó</span>
          <hr className="flex-1 border-gray-200" />
        </div>

        <p className="text-center text-sm text-gray-400">
          ¿Eres estudiante?{' '}
          <button type="button" onClick={() => { setIsStudent(true); setAdminUser(''); setAdminPassword(''); setAdminError('') }}
            className="text-violet-600 font-semibold hover:underline">
            Ingresa aquí
          </button>
        </p>
      </div>

      {/* Panel estudiante */}
      <div className={`w-full md:w-1/2 p-6 md:p-10 flex-col justify-center gap-4 z-10 ${!isStudent ? 'hidden md:flex' : 'flex'}`}>
        <div className="w-11 h-11 rounded-2xl bg-violet-500 mx-auto shadow-md flex items-center justify-center">
          <span className="text-white font-black text-xl">S</span>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Portal Estudiantil</h2>
          <p className="text-gray-400 text-sm mt-1">Accede con tus credenciales</p>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Usuario</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-400" />
            <input
              type="text"
              value={studentUser}
              onChange={e => setStudentUser(e.target.value)}
              placeholder="Ingrese Usuario"
              className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Contraseña</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-400" />
            <input
              type={showStudentPassword ? 'text' : 'password'}
              value={studentPassword}
              onChange={e => setStudentPassword(e.target.value)}
              placeholder="••••••••••"
              className="w-full border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white"
            />
            <button type="button" onClick={() => setShowStudentPassword(!showStudentPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-violet-500 transition">
              {showStudentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {studentError && <p className="text-red-400 text-xs text-center">{studentError}</p>}

        <button type="button" onClick={handleStudentLogin} disabled={studentLoading}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2.5 rounded-xl font-semibold transition shadow-sm disabled:opacity-60 flex items-center justify-center gap-2">
          <LogIn size={17} />
          {studentLoading ? 'Iniciando...' : 'Iniciar sesión'}
        </button>

        <div className="flex items-center gap-3">
          <hr className="flex-1 border-gray-200" />
          <span className="text-xs text-gray-400">ó</span>
          <hr className="flex-1 border-gray-200" />
        </div>

        <p className="text-center text-sm text-gray-400">
          ¿Eres administrador?{' '}
          <button type="button" onClick={() => { setIsStudent(false); setStudentUser(''); setStudentPassword(''); setStudentError('') }}
            className="text-violet-600 font-semibold hover:underline">
            Ingresa aquí
          </button>
        </p>
      </div>

      {/* Panel deslizante lavanda — solo en escritorio */}
      <div
        className="hidden md:flex absolute inset-y-0 w-1/2 bg-violet-100 flex-col justify-between p-10 rounded-2xl transition-all duration-700 ease-in-out z-20 overflow-hidden"
        style={{ left: isStudent ? '0%' : '50%' }}
      >
        {/* Círculos decorativos */}
        <div className="absolute top-6 right-6 w-32 h-32 rounded-full bg-violet-300/50" />
        <div className="absolute top-16 right-20 w-16 h-16 rounded-full bg-violet-400/40" />
        <div className="absolute bottom-16 left-4 w-36 h-36 rounded-full bg-violet-300/40" />

        {/* Puntos decorativos arriba */}
        <div className="absolute top-8 left-8 grid grid-cols-4 gap-2">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-violet-400/40" />
          ))}
        </div>

        {/* Puntos decorativos abajo */}
        <div className="absolute bottom-12 right-6 grid grid-cols-4 gap-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-violet-400/40" />
          ))}
        </div>

        {/* Título con transición */}
        <div className="relative z-10 mt-4 h-36 overflow-hidden">
          <div className={`absolute transition-all duration-700 ease-in-out ${isStudent ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}>
            <h2 className="text-gray-800 text-4xl font-black leading-tight">Panel<br />Administrativo</h2>
            <p className="text-gray-400 text-sm mt-2">Gestiona estudiantes, asistencias,<br />turnos y mucho más desde un solo lugar.</p>
          </div>
          <div className={`absolute transition-all duration-700 ease-in-out ${isStudent ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
            <h2 className="text-gray-800 text-4xl font-black leading-tight">Hola,<br />Bienvenido</h2>
            <p className="text-gray-400 text-sm mt-2">Accede a tus turnos, pagos<br />y mucho más desde aquí.</p>
          </div>
        </div>

        {/* Imagen */}
        <div className="relative h-64 overflow-hidden">
          <img
            src="/admin.png"
            alt="Administrador"
            className={`w-64 mx-auto absolute inset-x-0 top-0 transition-all duration-700 ease-in-out ${isStudent ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}
          />
          <img
            src="/estudiante.png"
            alt="Estudiante"
            className={`w-64 mx-auto absolute inset-x-0 top-0 transition-all duration-700 ease-in-out ${isStudent ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}
          />
        </div>

        {/* Universidad */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet-200 flex items-center justify-center flex-shrink-0">
            <GraduationCap size={14} className="text-violet-600" />
          </div>
          <p className="text-gray-500 text-xs font-medium">Universidad Popular del Cesar</p>
        </div>
      </div>

    </div>
  )
}

export default LoginForm
