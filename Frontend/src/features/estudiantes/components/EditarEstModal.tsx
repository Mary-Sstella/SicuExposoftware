import { useState } from 'react'
import api from '../../../shared/api/axios'

interface Estudiante {
  id_estudiante: number
  nombres: string
  apellidos: string
  correo_personal: string
  programa: string
  estado: 'ACTIVO' | 'INACTIVO'
  dias: {
    lunes: boolean
    martes: boolean
    miercoles: boolean
    jueves: boolean
    viernes: boolean
  } | null
}

interface Props {
  estudiante: Estudiante
  onClose: () => void
  onSuccess: () => void
}

const diasSemana = [
  { key: 'lunes', label: 'Lunes' }, //key es el nombre que se usa en el Backend 
  { key: 'martes', label: 'Martes' },
  { key: 'miercoles', label: 'Miércoles' },
  { key: 'jueves', label: 'Jueves' },
  { key: 'viernes', label: 'Viernes' },
]

function EditarEstModal({ estudiante, onClose, onSuccess }: Props) {
  const [form, setForm] = useState({
    nombres: estudiante.nombres,
    apellidos: estudiante.apellidos,
    correo_personal: estudiante.correo_personal ?? '',
    programa: estudiante.programa,
    estado: estudiante.estado,
  })
  const [dias, setDias] = useState({
    lunes: estudiante.dias?.lunes ?? false,
    martes: estudiante.dias?.martes ?? false,
    miercoles: estudiante.dias?.miercoles ?? false,
    jueves: estudiante.dias?.jueves ?? false,
    viernes: estudiante.dias?.viernes ?? false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => { //React.ChangeEvent<HTMLInputElement... esta diciendo que esto solo puede venir de un input o select
    setForm({ ...form, [e.target.name]: e.target.value }) //e: es el evento del input tiene el nombre del campo y el valor nuevo
  } //copia lo que contiene el input y solo actualiza eso

  const handleDia = (dia: string) => { //editar el dia si esta seleccionado o no 
    setDias(prev => ({ ...prev, [dia]: !prev[dia as keyof typeof prev] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await api.put(`/estudiantes/${estudiante.id_estudiante}/dias`, { ...form, dias })
      onSuccess()
      onClose()
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(message || 'Error al actualizar estudiante')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 shadow-xl w-[520px] max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-gray-800">Editar Estudiante</h3>
            <p className="text-xs text-gray-400">Actualiza los datos del estudiante</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg font-bold">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Nombres</label>
              <input name="nombres" value={form.nombres} onChange={handleChange} required
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Apellidos</label>
              <input name="apellidos" value={form.apellidos} onChange={handleChange} required
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Carrera / Programa</label>
            <input name="programa" value={form.programa} onChange={handleChange} required
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">
              Correo personal <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <input name="correo_personal" type="email" value={form.correo_personal} onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Estado</label>
            <select name="estado" value={form.estado} onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white text-gray-600">
              <option value="ACTIVO">Activo</option>
              <option value="INACTIVO">Inactivo</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-2 block">Días de almuerzo</label>
            <div className="flex gap-2">
              {diasSemana.map(({ key, label }) => (
                <button type="button" key={key} onClick={() => handleDia(key)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    dias[key as keyof typeof dias]
                      ? 'bg-violet-500 text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-violet-100 hover:text-violet-600'
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
              className="flex-1 py-2 rounded-xl bg-gradient-to-br from-purple-600 via-purple-500 to-pink-400 text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60">
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default EditarEstModal
