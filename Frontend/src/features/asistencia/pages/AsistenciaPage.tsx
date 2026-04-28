import { useAsistencia } from '../hooks/useAsistencia'
import AsistenciaTable from '../components/AsistenciaTable'
import { Fingerprint, Keyboard } from 'lucide-react'

function AsistenciaPage() {
  const { asistencias, loading } = useAsistencia()

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-gray-50">

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center gap-3 min-h-[180px] border border-gray-100">
          <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center">
            <Fingerprint size={36} className="text-violet-500" />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-gray-700">Lector Biométrico</p>
            <p className="text-xs text-gray-400">Sistema de verificación en tiempo real</p>
          </div>
          <span className="text-xs px-3 py-1 bg-gray-100 text-gray-400 rounded-full">Esperando huella...</span>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Keyboard size={18} className="text-violet-500" />
            <p className="text-sm font-bold text-gray-700">Ingreso Manual</p>
          </div>
          <p className="text-xs text-gray-400 mb-3">Alternativa por teclado</p>
          <label className="text-xs font-semibold text-gray-600 mb-1 block">Cédula del Estudiante</label>
          <input
            type="text"
            placeholder="Ingrese la cédula..."
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 mb-3"
          />
          <button className="w-full py-2 rounded-xl bg-gradient-to-br from-purple-600 via-purple-500 to-pink-400 text-white text-sm font-semibold hover:opacity-90 transition-opacity">
            Registrar Entrada
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-gray-700">Asistencias de Hoy</h2>
            <p className="text-xs text-gray-400">{asistencias.length} estudiantes con reserva</p>
          </div>
        </div>
        {loading ? (
          <p className="text-sm text-gray-400">Cargando...</p>
        ) : (
          <AsistenciaTable asistencias={asistencias} />
        )}
      </div>

    </div>
  )
}

export default AsistenciaPage
