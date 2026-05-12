import { Calendar, Clock } from 'lucide-react'
import { useMisTurnos } from '../hooks/useMisTurnos'

const DIAS_LABELS: { key: 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes'; label: string }[] = [
  { key: 'lunes', label: 'Lunes' },
  { key: 'martes', label: 'Martes' },
  { key: 'miercoles', label: 'Miércoles' },
  { key: 'jueves', label: 'Jueves' },
  { key: 'viernes', label: 'Viernes' },
]

function MisReservas() {
  const { turno, loading } = useMisTurnos()

  if (loading) return <p className="text-sm text-gray-400">Cargando...</p>

  const diasHabilitados = turno
    ? DIAS_LABELS.filter(d => turno[d.key])
    : []

  const formatFecha = (fecha: string) =>
    new Date(fecha).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'America/Bogota' })

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4">
      <h3 className="text-sm font-bold text-gray-700">Mis reservas</h3>

      {!turno || !turno.numero_turno ? (
        <p className="text-xs text-gray-400">No tienes reservas registradas</p>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-pink-400" />
              <span className="text-xs text-gray-600 font-medium">{formatFecha(turno.fecha)}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <Clock size={12} />
              <span className="text-xs">{turno.hora_inicio} – {turno.hora_fin}</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
              turno.estado === 'PRESENTE'
                ? 'bg-green-100 text-green-600'
                : turno.estado === 'AUSENTE'
                ? 'bg-red-100 text-red-500'
                : 'bg-amber-100 text-amber-600'
            }`}>
              {turno.estado}
            </span>
          </div>
        </div>
      )}

      {diasHabilitados.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-2">Días habilitados</p>
          <div className="flex gap-2 flex-wrap">
            {diasHabilitados.map(({ key, label }) => (
              <span key={key} className="text-xs px-3 py-1 rounded-full bg-pink-50 text-pink-500 font-medium">
                {label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default MisReservas
