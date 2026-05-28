import { useState } from 'react'
import { Fingerprint, CheckCircle2, XCircle } from 'lucide-react'
import api from '../../../shared/api/axios'

interface Props {
  onAsistenciaRegistrada: () => void
}

interface Resultado {
  success: boolean
  mensaje: string
  estudiante?: { id: number; nombre: string }
}

function HuellaPanel({ onAsistenciaRegistrada }: Props) {
  const [fingerId, setFingerId] = useState('')
  const [validando, setValidando] = useState(false)
  const [resultado, setResultado] = useState<Resultado | null>(null)

  const handleValidar = async () => {
    if (!fingerId.trim()) return
    setValidando(true)
    setResultado(null)
    try {
      const res = await api.post('/biometria/validar', { finger_id: Number(fingerId) })
      setResultado(res.data)
      if (res.data.success) onAsistenciaRegistrada()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { msg?: string } } })?.response?.data?.msg
      setResultado({ success: false, mensaje: msg || 'Error al validar huella' })
    } finally {
      setValidando(false)
    }
  }

  const reiniciar = () => {
    setResultado(null)
    setFingerId('')
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4 border border-gray-700">
      <div className="flex items-center gap-2">
        <Fingerprint size={18} className="text-violet-500" />
        <p className="text-sm font-bold text-gray-700">Huella Digital</p>
        <p className="text-xs text-gray-400 ml-auto">Asistencia biométrica</p>
      </div>

      {!resultado ? (
        <>
          <div className="flex flex-col items-center gap-3 py-2">
            <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center">
              <Fingerprint size={36} className="text-violet-400" strokeWidth={1.5} />
            </div>
            <p className="text-xs text-gray-400 text-center">Ingresa el ID del lector o pon el dedo en el sensor</p>
          </div>
          <input
            type="number"
            placeholder="ID de huella..."
            value={fingerId}
            onChange={e => setFingerId(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleValidar()}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
          />
          <button
            onClick={handleValidar}
            disabled={!fingerId.trim() || validando}
            className="w-full py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-xl transition disabled:opacity-60"
          >
            {validando ? 'Validando...' : 'Registrar Asistencia'}
          </button>
        </>
      ) : (
        <div className="flex flex-col gap-3">
          <div className={`flex items-center gap-2 ${resultado.success ? 'text-green-600' : 'text-red-500'}`}>
            {resultado.success ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
            <span className="text-sm font-bold">{resultado.success ? 'Asistencia registrada' : 'Error'}</span>
          </div>
          {resultado.estudiante && (
            <div className="bg-green-50 rounded-xl p-4">
              <p className="text-base font-black text-gray-800">{resultado.estudiante.nombre}</p>
            </div>
          )}
          {!resultado.success && (
            <div className="bg-red-50 rounded-xl px-4 py-3">
              <p className="text-xs text-red-500">{resultado.mensaje}</p>
            </div>
          )}
          <button onClick={reiniciar} className="flex items-center justify-center gap-1.5 text-xs text-violet-600 hover:underline">
            Intentar de nuevo
          </button>
        </div>
      )}
    </div>
  )
}

export default HuellaPanel