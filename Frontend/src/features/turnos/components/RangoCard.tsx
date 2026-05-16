import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { updateConfiguracion } from '../services/turnosService'

interface Rango {
  id_configuracion: number
  hora_inicio: string
  hora_fin: string
  capacidad_maxima: number
  activo: boolean
}

interface Turno {
  numero_turno: number
  nombres: string
  apellidos: string
  numero_identificacion: string
  programa: string
  estado: string
}

interface Props {
  rango: Rango
  turnos: Turno[]
  onToggle: () => void
}

function RangoCard({ rango, turnos, onToggle }: Props) {
  const [expandido, setExpandido] = useState(true)
  const ocupados = turnos.length
  const porcentaje = Math.round((ocupados / rango.capacidad_maxima) * 100)
  const lleno = ocupados >= rango.capacidad_maxima
  const casiLleno = !lleno && porcentaje >= 70

  const handleToggle = async () => {
    await updateConfiguracion(rango.id_configuracion, { activo: !rango.activo })
    onToggle()
  }

  return (
    <div className={`bg-white rounded-2xl shadow-sm overflow-hidden ${!rango.activo ? 'opacity-50 grayscale' : ''}`}>
      <div className="px-5 py-4 flex items-center justify-between border-b border-gray-50">
        <div className="flex items-center gap-3">
          <button onClick={() => setExpandido(!expandido)} className="text-gray-400 hover:text-violet-500">
            {expandido ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <div>
            <p className="text-sm font-bold text-gray-700">{rango.hora_inicio} – {rango.hora_fin}</p>
            <p className="text-xs text-gray-400">{ocupados} / {rango.capacidad_maxima} cupos ocupados</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
            lleno ? 'bg-red-100 text-red-500' : casiLleno ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'
          }`}>
            {lleno ? 'Lleno' : casiLleno ? 'Casi lleno' : 'Disponible'}
          </span>
          <button
          onClick={handleToggle}
          className={`text-xs px-3 py-1 rounded-full font-semibold transition-colors ${
            rango.activo
            ? 'bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-500'
            : 'bg-green-100 text-green-600 hover:bg-green-200'
            }`}
            >
              {rango.activo ? 'Desactivar' : 'Activar'}
          </button>
        </div>
      </div>

      <div className="px-5 pt-3 pb-1">
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full transition-all ${
              lleno ? 'bg-red-400' : casiLleno ? 'bg-amber-400' : 'bg-gradient-to-r from-violet-500 to-purple-300'
            }`}
            style={{ width: `${Math.min(porcentaje, 100)}%` }}
          />
        </div>
      </div>

      {expandido && (
        <div className="px-5 pb-4">
          {turnos.length === 0 ? (
            <p className="text-xs text-gray-400 py-3 text-center">Sin reservas en este horario</p>
          ) : (
            <table className="w-full text-xs mt-3">
              <thead>
                <tr className="text-gray-400">
                  <th className="text-left pb-2 font-medium">#</th>
                  <th className="text-left pb-2 font-medium">Estudiante</th>
                  <th className="text-left pb-2 font-medium">Cédula</th>
                  <th className="text-left pb-2 font-medium">Carrera</th>
                  <th className="text-left pb-2 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {turnos.map((t, i) => (
                  <tr key={i} className="border-t border-gray-50">
                    <td className="py-2 text-violet-600 font-bold">#{t.numero_turno}</td>
                    <td className="py-2 text-gray-700 font-semibold">{t.nombres} {t.apellidos}</td>
                    <td className="py-2 text-gray-400">{t.numero_identificacion}</td>
                    <td className="py-2 text-gray-400">{t.programa}</td>
                    <td className="py-2">
                      <span className={`px-2 py-0.5 rounded-full font-semibold ${
                        t.estado === 'ENTREGADA' || t.estado === 'CONFIRMADO'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {t.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}

export default RangoCard
