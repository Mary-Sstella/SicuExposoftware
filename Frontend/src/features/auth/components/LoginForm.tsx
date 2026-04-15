import { useState } from "react"

function LoginForm() {
  const [isStudent, setIsStudent] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex w-full rounded-2xl shadow-2xl overflow-hidden bg-white relative" style={{ minHeight: '520px' }}>

      {/* Panel izquierdo - formulario admin */}
      <div
        className="absolute inset-y-0 left-0 w-1/2 p-10 flex flex-col justify-center gap-4 transition-all duration-700 ease-in-out"
        style={{ transform: isStudent ? 'translateX(-100%)' : 'translateX(0)', opacity: isStudent ? 0 : 1 }}
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-400 mx-auto shadow-lg" />

        <div>
          <h2 className="text-2xl font-bold text-gray-800">Bienvenido</h2>
          <p className="text-gray-400 text-sm mt-1">Accede al panel administrativo</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Usuario o Correo</label>
          <input
            type="text"
            placeholder="ejemplo@universidad.edu"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Contraseña</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-400 text-xs hover:text-purple-500 transition"
            >
              {showPassword ? 'Ocultar' : 'Ver'}
            </button>
          </div>
        </div>

        <button
          type="button"
          className="w-full bg-gradient-to-r from-purple-500 to-pink-400 text-white py-2.5 rounded-xl font-semibold hover:opacity-90 transition shadow-md"
        >
          Iniciar sesión →
        </button>

        <p className="text-center text-sm text-gray-400">
          ¿Eres estudiante?{' '}
          <button
            type="button"
            onClick={() => setIsStudent(true)}
            className="text-purple-500 font-semibold hover:underline"
          >
            Ingresa aquí
          </button>
        </p>
      </div>

      {/* Panel izquierdo - mensaje estudiante */}
      <div
        className="absolute inset-y-0 left-0 w-1/2 p-10 flex flex-col justify-center gap-4 transition-all duration-700 ease-in-out"
        style={{ transform: isStudent ? 'translateX(0)' : 'translateX(-100%)', opacity: isStudent ? 1 : 0 }}
      >
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🎓</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Portal Estudiantil</h2>
          <p className="text-gray-400 text-sm mt-2">El acceso para estudiantes estará disponible próximamente.</p>
        </div>

        <button
          type="button"
          onClick={() => setIsStudent(false)}
          className="w-full border-2 border-purple-400 text-purple-500 py-2.5 rounded-xl font-semibold hover:bg-purple-50 transition"
        >
          ← Volver al admin
        </button>
      </div>

      {/* Panel derecho - decorativo */}
      <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-br from-purple-600 via-purple-500 to-pink-400 flex flex-col justify-between p-10 transition-all duration-700 ease-in-out rounded-l-3xl">
        
        {/* Círculos decorativos */}
        <div className="absolute top-10 right-10 w-24 h-24 rounded-full bg-white/10" />
        <div className="absolute top-20 right-20 w-12 h-12 rounded-full bg-white/10" />
        <div className="absolute bottom-16 left-8 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute bottom-8 left-16 w-16 h-16 rounded-full bg-pink-300/20" />

        <div className="relative z-10 mt-10">
          <h2 className="text-white text-3xl font-bold leading-tight">
            {isStudent ? 'Bienvenido,\nEstudiante' : 'Hola,\nBienvenido'}
          </h2>
          <p className="text-white/70 text-sm mt-3">
            {isStudent
              ? 'Pronto podrás gestionar tu asistencia y turnos desde aquí.'
              : 'Gestiona el comedor universitario desde un solo lugar.'}
          </p>
        </div>

        <p className="text-white/40 text-xs relative z-10">Universidad Popular del Cesar</p>
      </div>

    </div>
  )
}

export default LoginForm