import { useState } from 'react'
import { Users, Clock, AlertTriangle, CheckCircle, Search, Bell } from 'lucide-react'
import { useTurnos } from '../hooks/useTurnos'
import { useConfiguracion } from '../hooks/useConfiguracion'
import RangoCard from '../components/RangoCard'

function TurnosPage() {
  const hoy = new Date().toISOString().split('T')[0]
  const [fecha, setFecha] = useState(hoy)
  const [buscar, setBuscar] = useState('')
  const { turnos, loading } = useTurnos(fecha, buscar)
  const { rangos, refetch: refetchRangos } = useConfiguracion()

  const totalReservas = turnos.length
  const rangosActivos = rangos.filter(r => r.activo).length

  const casiLlenos = rangos.filter(r => {
    const ocu = turnos.filter(t => t.hora_inicio === r.hora_inicio).length
    return ocu / r.capacidad_maxima >= 0.7 && ocu < r.capacidad_maxima
  }).length

  const completos = rangos.filter(r => {
    const ocu = turnos.filter(t => t.hora_inicio === r.hora_inicio).length
    return ocu >= r.capacidad_maxima
  }).length

  const stats = [
    { title: 'Total Reservas',   value: totalReservas,  icon: <Users size={22} className="text-white" />,         gradient: 'bg-gradient-to-br from-pink-500 to-rose-400' },
    { title: 'Horarios activos', value: rangosActivos,  icon: <Clock size={22} className="text-white" />,         gradient: 'bg-gradient-to-br from-violet-500 to-indigo-400' },
    { title: 'Casi Llenos',      value: casiLlenos,     icon: <AlertTriangle size={22} className="text-white" />, gradient: 'bg-gradient-to-br from-orange-500 to-amber-300' },
    { title: 'Completos',        value: completos,      icon: <CheckCircle size={22} className="text-white" />,   gradient: 'bg-gradient-to-br from-cyan-400 to-blue-400' },
  ]

  const alertasCompletos = rangos.filter(r => turnos.filter(t => t.hora_inicio === r.hora_inicio).length >= r.capacidad_maxima)
  const alertasCasi = rangos.filter(r => {
    const ocu = turnos.filter(t => t.hora_inicio === r.hora_inicio).length
    return ocu / r.capacidad_maxima >= 0.7 && ocu < r.capacidad_maxima
  })

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-slate-100">

      <div className="flex items-center justify-between mb-6">
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="border border-gray-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white shadow-sm"
        />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.title} className="bg-white rounded-2xl p-5 shadow-md border border-gray-700 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${s.gradient}`}>
              {s.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{s.value}</p>
              <p className="text-sm text-gray-500">{s.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-3 gap-4">

        {/* Rangos + turnos */}
        <div className="col-span-2 flex flex-col gap-4">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar estudiante o cédula..."
              value={buscar}
              onChange={(e) => setBuscar(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white"
            />
          </div>
          {loading ? (
            <p className="text-sm text-gray-400">Cargando...</p>
          ) : rangos.length === 0 ? (
            <p className="text-sm text-gray-400">No hay rangos horarios activos</p>
          ) : (
            rangos.map((rango) => (
              <RangoCard
                key={rango.id_configuracion}
                rango={rango}
                turnos={turnos.filter(t => t.hora_inicio === rango.hora_inicio)}
                onToggle={refetchRangos}
              />
            ))
          )}
        </div>

        {/* Panel derecho */}
        <div className="flex flex-col gap-4">

          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
                <Bell size={15} className="text-violet-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-700">Alertas</h3>
              </div>
            </div>
            {alertasCompletos.length === 0 && alertasCasi.length === 0 ? (
              <p className="text-xs text-gray-400">Sin alertas por ahora</p>
            ) : (
              <div className="flex flex-col gap-2">
                {alertasCompletos.map(r => (
                  <div key={r.id_configuracion} className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-xl">
                    <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-red-600">{r.hora_inicio} – {r.hora_fin}</p>
                      <p className="text-xs text-red-400">Rango completo</p>
                    </div>
                  </div>
                ))}
                {alertasCasi.map(r => {
                  const ocu = turnos.filter(t => t.hora_inicio === r.hora_inicio).length
                  return (
                    <div key={r.id_configuracion} className="flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-xl">
                      <AlertTriangle size={16} className="text-amber-500 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-amber-600">{r.hora_inicio} – {r.hora_fin}</p>
                        <p className="text-xs text-amber-400">{r.capacidad_maxima - ocu} cupos restantes</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
                <Clock size={15} className="text-violet-500" />
              </div>
              <h3 className="text-sm font-bold text-gray-700">Rangos horarios</h3>
            </div>
            <div className="flex flex-col gap-2">
              {rangos.filter(r => r.activo).map(r => {
                const ocu = turnos.filter(t => t.hora_inicio === r.hora_inicio).length
                const pct = Math.round((ocu / r.capacidad_maxima) * 100)
                const lleno = ocu >= r.capacidad_maxima
                const casi = !lleno && pct >= 70
                return (
                  <div key={r.id_configuracion} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-xs font-semibold text-gray-700">{r.hora_inicio} – {r.hora_fin}</p>
                      <p className="text-xs text-gray-400">{ocu}/{r.capacidad_maxima} · {pct}%</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${
                      lleno ? 'border-red-200 text-red-500' : casi ? 'border-amber-200 text-amber-600' : 'border-green-200 text-green-600'
                    }`}>
                      {lleno ? 'Lleno' : casi ? 'Casi lleno' : 'Disponible'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default TurnosPage
