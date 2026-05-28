import { useState } from 'react'
import { Fingerprint, Search, CheckCircle2, XCircle, Loader2, UserCheck } from 'lucide-react'
import api from '../../../shared/api/axios'

interface Estudiante {
  id_estudiante: number
  nombres: string
  apellidos: string
  numero_identificacion: string
  programa: string
  finger_id: number | null
}

interface ResultadoValidacion {
  success: boolean
  mensaje: string
  estudiante?: { id: number; nombre: string }
}

function BiometriaPage() {
  // Sección registro de huella
  const [busqueda, setBusqueda] = useState('')
  const [estudiante, setEstudiante] = useState<Estudiante | null>(null)
  const [buscando, setBuscando] = useState(false)
  const [fingerId, setFingerId] = useState('')
  const [registrando, setRegistrando] = useState(false)
  const [msgRegistro, setMsgRegistro] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null)

  // Sección validación de huella
  const [fingerIdValidar, setFingerIdValidar] = useState('')
  const [validando, setValidando] = useState(false)
  const [resultado, setResultado] = useState<ResultadoValidacion | null>(null)

  const buscarEstudiante = async () => {
    if (!busqueda.trim()) return
    setBuscando(true)
    setEstudiante(null)
    setMsgRegistro(null)
    try {
      const res = await api.get(`/biometria/estudiante/${busqueda.trim()}`)
      setEstudiante(res.data)
    } catch {
      setMsgRegistro({ tipo: 'error', texto: 'Estudiante no encontrado' })
    } finally {
      setBuscando(false)
    }
  }

  const handleRegistrarHuella = async () => {
    if (!estudiante || !fingerId.trim()) return
    setRegistrando(true)
    setMsgRegistro(null)
    try {
      await api.post('/biometria/registrar', {
        id_estudiante: estudiante.id_estudiante,
        finger_id: Number(fingerId),
      })
      setMsgRegistro({ tipo: 'ok', texto: `Huella registrada correctamente para ${estudiante.nombres} ${estudiante.apellidos}` })
      setEstudiante({ ...estudiante, finger_id: Number(fingerId) })
      setFingerId('')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { msg?: string } } })?.response?.data?.msg
      setMsgRegistro({ tipo: 'error', texto: msg || 'Error al registrar la huella' })
    } finally {
      setRegistrando(false)
    }
  }

  const handleValidarHuella = async () => {
    if (!fingerIdValidar.trim()) return
    setValidando(true)
    setResultado(null)
    try {
      const res = await api.post('/biometria/validar', { finger_id: Number(fingerIdValidar) })
      setResultado(res.data)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { msg?: string } } })?.response?.data?.msg
      setResultado({ success: false, mensaje: msg || 'Error al validar huella' })
    } finally {
      setValidando(false)
    }
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Biometría</h1>

      <div className="grid grid-cols-2 gap-6">

        {/* Panel izquierdo: Registrar huella */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <UserCheck size={18} className="text-violet-500" />
            <p className="text-sm font-bold text-gray-700">Registrar Huella</p>
          </div>
          <p className="text-xs text-gray-400 -mt-3">Busca al estudiante y asígnale un ID de huella del lector</p>

          {/* Buscar estudiante */}
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Cédula del estudiante</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ej: 1067121844"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && buscarEstudiante()}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
              />
              <button
                onClick={buscarEstudiante}
                disabled={buscando}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl transition disabled:opacity-60"
              >
                {buscando ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              </button>
            </div>
          </div>

          {/* Info estudiante encontrado */}
          {estudiante && (
            <div className="bg-violet-50 rounded-xl p-4 flex flex-col gap-1.5">
              <p className="text-sm font-black text-gray-800">{estudiante.nombres} {estudiante.apellidos}</p>
              <p className="text-xs text-gray-500">C.C. {estudiante.numero_identificacion}</p>
              <p className="text-xs text-gray-400">{estudiante.programa}</p>
              {estudiante.finger_id !== null ? (
                <span className="text-xs text-green-600 font-semibold mt-1">
                  ✓ Ya tiene huella registrada (ID: {estudiante.finger_id})
                </span>
              ) : (
                <span className="text-xs text-amber-500 font-semibold mt-1">Sin huella registrada</span>
              )}
            </div>
          )}

          {/* Input finger_id */}
          {estudiante && (
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
                ID de huella del lector
              </label>
              <input
                type="number"
                placeholder="Ej: 1, 2, 3..."
                value={fingerId}
                onChange={e => setFingerId(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
              />
              <p className="text-[10px] text-gray-400 mt-1">
                Ingresa el número de posición donde quedó guardada la huella en el lector físico
              </p>
            </div>
          )}

          {/* Mensaje */}
          {msgRegistro && (
            <p className={`text-xs px-3 py-2 rounded-xl ${msgRegistro.tipo === 'ok' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
              {msgRegistro.texto}
            </p>
          )}

          {/* Botón registrar */}
          {estudiante && (
            <button
              onClick={handleRegistrarHuella}
              disabled={!fingerId.trim() || registrando}
              className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-xl transition disabled:opacity-50"
            >
              {registrando ? 'Registrando...' : 'Registrar Huella'}
            </button>
          )}
        </div>

        {/* Panel derecho: Validar huella (prueba manual) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <Fingerprint size={18} className="text-violet-500" />
            <p className="text-sm font-bold text-gray-700">Validar Huella</p>
          </div>
          <p className="text-xs text-gray-400 -mt-3">Ingresa el ID de huella manualmente para probar la validación</p>

          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">ID de huella</label>
            <input
              type="number"
              placeholder="Ej: 1, 2, 3..."
              value={fingerIdValidar}
              onChange={e => setFingerIdValidar(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleValidarHuella()}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
          </div>

          <button
            onClick={handleValidarHuella}
            disabled={!fingerIdValidar.trim() || validando}
            className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-xl transition disabled:opacity-50"
          >
            {validando ? 'Validando...' : 'Validar Huella'}
          </button>

          {resultado && (
            <div className={`rounded-xl p-4 flex flex-col gap-2 ${resultado.success ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex items-center gap-2">
                {resultado.success
                  ? <CheckCircle2 size={18} className="text-green-500" />
                  : <XCircle size={18} className="text-red-400" />}
                <span className={`text-sm font-bold ${resultado.success ? 'text-green-700' : 'text-red-500'}`}>
                  {resultado.mensaje}
                </span>
              </div>
              {resultado.estudiante && (
                <p className="text-xs text-gray-600 ml-6">{resultado.estudiante.nombre}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BiometriaPage