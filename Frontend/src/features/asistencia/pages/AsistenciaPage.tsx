import { useState } from 'react'
import { useAsistencia } from '../hooks/useAsistencia'
import AsistenciaTable from '../components/AsistenciaTable'
import { Keyboard, Monitor } from 'lucide-react'
import api from '../../../shared/api/axios'
import EscanerQR from '../components/EscanerQR'

function AsistenciaPage() {
  const { asistencias, loading, refetch } = useAsistencia()
  const [cedula, setCedula] = useState('')
  const [registrando, setRegistrando] = useState(false)
  const [mensaje, setMensaje] = useState<{ tipo: 'ok' | 'error', texto: string } | null>(null)

  const handleRegistrar = async () => {
    if (!cedula.trim()) return
    setRegistrando(true)
    setMensaje(null)
    try {
      const res = await api.post('/asistencia', { numero_identificacion: cedula })
      setMensaje({ tipo: 'ok', texto: res.data.msg })
      setCedula('')
      refetch()
    } catch (err: unknown) {
      const texto = (err as { response?: { data?: { msg?: string } } })?.response?.data?.msg
      setMensaje({ tipo: 'error', texto: texto || 'Error al registrar asistencia' })
    } finally {
      setRegistrando(false)
    }
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-gray-50 dark:bg-gray-950">

      <div className="grid grid-cols-2 gap-4 mb-6">
        <EscanerQR />
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Keyboard size={18} className="text-violet-500" />
              <p className="text-sm font-bold text-gray-700 dark:text-gray-200">Ingreso Manual</p>
            </div>
            <p className="text-xs text-gray-400">Alternativa por teclado</p>
          </div>
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block mt-3">Cédula del Estudiante</label>
          <input
            type="text"
            placeholder="Ingrese la cédula..."
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRegistrar()}
            className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-500 mb-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 dark:placeholder-gray-500"
          />
          {mensaje && (
            <p className={`text-xs px-3 py-2 rounded-xl mb-2 ${
              mensaje.tipo === 'ok'
                ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400'
            }`}>
              {mensaje.texto}
            </p>
          )}
          <button
            onClick={handleRegistrar}
            disabled={registrando}
            className="w-full py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold border-2 border-violet-900 transition-all disabled:opacity-60">
            {registrando ? 'Registrando...' : 'Registrar Entrada'}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200">Asistencias de Hoy</h2>
            <p className="text-xs text-gray-400">{asistencias.length} estudiantes con reserva</p>
          </div>
          <button
            onClick={() => window.open('/turnero', '_blank')}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl transition"
          >
            <Monitor size={16} />
            Proyectar Turnero
          </button>
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
