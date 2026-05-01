import { useState } from 'react'
import api from '../../../shared/api/axios'

interface Props {
  onClose: () => void
  onSuccess: () => void
}

const tiposIdentificacion = [
  { value: 'CC', label: 'Cédula de Ciudadanía' },
  { value: 'TI', label: 'Tarjeta de Identidad' },
  { value: 'CE', label: 'Cédula de Extranjería' },
]

const diasSemana = [
  { key: 'lunes', label: 'Lunes' },
  { key: 'martes', label: 'Martes' },
  { key: 'miercoles', label: 'Miércoles' },
  { key: 'jueves', label: 'Jueves' },
  { key: 'viernes', label: 'Viernes' },
]

function InscribirEstudianteModal({ onClose, onSuccess }: Props) {
  const [form, setForm] = useState({ //para guardar datos actuales y poder actualizar estos 
    nombres: '',
    apellidos: '',
    tipo_identificacion: '',
    numero_identificacion: '',
    programa: '',
    correo_institucional: '',
    correo_personal: '',
  })
  const [dias, setDias] = useState({
    lunes: false, martes: false, miercoles: false, jueves: false, viernes: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleDia = (dia: string) => {
    setDias(prev => ({ ...prev, [dia]: !prev[dia as keyof typeof prev] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  setError(null)
  try {
    const body: Record<string, unknown> = {
      ...form,
      estado: 'ACTIVO',
      contador_inasistencias: 0,
      limite_inasistencias: 0,
    }
    if (!body.correo_personal) delete body.correo_personal

    const estudianteCreado = await api.post('/estudiantes', body)

    await api.put(`/estudiantes/${estudianteCreado.data.id_estudiante}/dias`, {
      dias: {
        lunes: dias.lunes,
        martes: dias.martes,
        miercoles: dias.miercoles,
        jueves: dias.jueves,
        viernes: dias.viernes,
      }
    })



    onSuccess()
    onClose()
  } catch (err: unknown) {
    const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
    setError(message || 'Error al inscribir estudiante')
  } finally {
    setLoading(false)
  }
}


  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 shadow-xl w-[560px] max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-gray-800">Inscribir Estudiante</h3>
            <p className="text-xs text-gray-400">Completa los datos del nuevo estudiante</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg font-bold">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Nombres</label>
              <input name="nombres" value={form.nombres} onChange={handleChange} required
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                placeholder="Nombres" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Apellidos</label>
              <input name="apellidos" value={form.apellidos} onChange={handleChange} required
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                placeholder="Apellidos" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Tipo de identificación</label>
              <select name="tipo_identificacion" value={form.tipo_identificacion} onChange={handleChange} required
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white text-gray-600">
                <option value="">Seleccionar...</option>
                {tiposIdentificacion.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Número de identificación</label>
              <input name="numero_identificacion" value={form.numero_identificacion} onChange={handleChange} required
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                placeholder="Número" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Carrera / Programa</label>
            <input name="programa" value={form.programa} onChange={handleChange} required
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="Nombre del programa" />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Correo institucional</label>
            <input name="correo_institucional" type="email" value={form.correo_institucional} onChange={handleChange} required
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="ejemplo@unicesar.edu.co" />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">
              Correo personal <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <input name="correo_personal" type="email" value={form.correo_personal} onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="correo@gmail.com" />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-2 block">Días de almuerzo</label>
            <div className="flex gap-2">
              {diasSemana.map(({ key, label }) => (
                <button type="button" key={key} onClick={() => handleDia(key)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    dias[key as keyof typeof dias]
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-pink-100 hover:text-pink-600'
                  }`}>
                  {label.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-xl">{error}</p>}

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2 rounded-xl bg-gradient-to-br from-pink-500 via-pink-400 to-orange-400 text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60">
              {loading ? 'Inscribiendo...' : 'Inscribir'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default InscribirEstudianteModal
