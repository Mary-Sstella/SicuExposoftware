import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, FileText, ChevronRight, X, Calendar, MapPin, Truck, Users, Mail, CreditCard } from 'lucide-react'
import { getInscripciones, getInscripcionById, aprobarInscripcion, rechazarInscripcion, getCupos } from '../../inscripcion/services/inscripcionesService'

type Solicitudes = {
  id_inscripcion: number
  nombre: string
  apellidos: string
  cedula: string
  estado: string
  fecha_solicitud: string
}

type SolicitudDetalle = Solicitudes & {
  correo_institucional: string
  correo_personal: string | null
  lugar_origen: string
  lugar_residencia: string
  medio_transporte: string
  ocupacion_padres: string
  dias_semana: string
  genero: string
  sisben_url: string
  cedula_url: string
}

type Cupos = { ocupados: number; total: number }
type CuposDias = { lunes: Cupos; martes: Cupos; miercoles: Cupos; jueves: Cupos; viernes: Cupos }

const ESTADO_BADGE: Record<string, string> = {
  'PENDIENTE': 'bg-amber-50 border border-amber-200 text-amber-600',
  'APROBADO':  'bg-green-50 border border-green-200 text-green-600',
  'RECHAZADO': 'bg-red-50 border border-red-200 text-red-500',
}

const CUPOS_CONFIG = [
  { key: 'lunes',     label: 'LUNES',     initial: 'L', iconBg: 'from-violet-400 to-purple-400', bar: 'bg-violet-400', text: 'text-violet-600' },
  { key: 'martes',    label: 'MARTES',    initial: 'M', iconBg: 'from-violet-400 to-purple-400', bar: 'bg-violet-400', text: 'text-violet-600' },
  { key: 'miercoles', label: 'MIÉRCOLES', initial: 'M', iconBg: 'from-violet-400 to-purple-400', bar: 'bg-violet-400', text: 'text-violet-600' },
  { key: 'jueves',    label: 'JUEVES',    initial: 'J', iconBg: 'from-violet-400 to-purple-400', bar: 'bg-violet-400', text: 'text-violet-600' },
  { key: 'viernes',   label: 'VIERNES',   initial: 'V', iconBg: 'from-violet-400 to-purple-400', bar: 'bg-violet-400', text: 'text-violet-600' },
] as const

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
const POR_PAGINA = 9

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-gray-300 mt-0.5 flex-shrink-0">{icon}</span>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  )
}

function SolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState<Solicitudes[]>([])
  const [selected, setSelected] = useState<SolicitudDetalle | null>(null)
  const [loadingList, setLoadingList] = useState(true)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [diasSeleccionados, setDiasSeleccionados] = useState<string[]>([])
  const [cupos, setCupos] = useState<CuposDias | null>(null)
  const [pagina, setPagina] = useState(1)

  useEffect(() => {
    fetchSolicitudes()
    getCupos().then(setCupos)
  }, [])

  const fetchSolicitudes = async () => {
    try {
      const data = await getInscripciones()
      setSolicitudes(data)
    } finally {
      setLoadingList(false)
    }
  }

  const handleSelect = async (id: number) => {
    setDrawerOpen(true)
    setLoadingDetail(true)
    try {
      const data = await getInscripcionById(id)
      setSelected(data)
      setDiasSeleccionados(data.dias_semana ? data.dias_semana.split(',').map((d: string) => d.trim()) : [])
    } finally {
      setLoadingDetail(false)
    }
  }

  const handleAprobar = async () => {
    if (!selected) return
    if (!confirm('¿Aprobar esta solicitud? El estudiante será registrado en el sistema.')) return
    try {
      await aprobarInscripcion(selected.id_inscripcion, diasSeleccionados)
      setDrawerOpen(false)
      setSelected(null)
      fetchSolicitudes()
    } catch (e: any) {
      const msg = e?.response?.data?.msg ?? 'Error al aprobar la solicitud'
      alert(msg)
    }
  }

  const handleRechazar = async () => {
    if (!selected) return
    if (!confirm('¿Rechazar esta solicitud? Se eliminarán todos sus datos y archivos.')) return
    await rechazarInscripcion(selected.id_inscripcion)
    setDrawerOpen(false)
    setSelected(null)
    fetchSolicitudes()
  }

  const totalPaginas = Math.ceil(solicitudes.length / POR_PAGINA)
  const inicio = (pagina - 1) * POR_PAGINA
  const solicitudesPagina = solicitudes.slice(inicio, inicio + POR_PAGINA)

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-slate-100 flex flex-col gap-6">

      {/* Cupos por día */}
      {cupos && (
        <div className="flex gap-4">
          {CUPOS_CONFIG.map(({ key, label, iconBg, bar, text, initial }) => {
            const data = cupos[key]
            const libres = data.total - data.ocupados
            const pct = Math.round((data.ocupados / data.total) * 100)
            return (
              <div key={key} className="flex-1 bg-white rounded-2xl border border-gray-700 p-4 flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${iconBg} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white font-black text-base">{initial}</span>
                  </div>
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-wide ${text}`}>{label}</p>
                    <p className="text-base font-bold text-gray-800 leading-tight">
                      {data.ocupados}<span className="text-gray-400 font-normal text-sm">/{data.total}</span>
                    </p>
                    <p className="text-xs text-gray-400">{libres} libres</p>
                  </div>
                </div>
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${bar}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Tabla + Drawer */}
      <div className="flex gap-4">

        {/* Tabla */}
        <div className={`bg-white rounded-2xl border border-gray-700 overflow-hidden flex flex-col ${drawerOpen ? 'flex-1' : 'w-full'}`}>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-violet-600 text-white text-left">
                <th className="px-6 py-3 font-medium rounded-tl-xl">Nombre</th>
                <th className="px-6 py-3 font-medium">Cédula</th>
                <th className="px-6 py-3 font-medium">Fecha solicitud</th>
                <th className="px-6 py-3 font-medium">Estado</th>
                <th className="px-6 py-3 rounded-tr-xl" />
              </tr>
            </thead>
            <tbody>
              {loadingList ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-400 text-sm">Cargando...</td></tr>
              ) : solicitudesPagina.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-400 text-sm">No hay solicitudes</td></tr>
              ) : (
                solicitudesPagina.map(i => (
                  <tr
                    key={i.id_inscripcion}
                    onClick={() => handleSelect(i.id_inscripcion)}
                    className={`border-t border-violet-400 cursor-pointer hover:bg-purple-50 transition-colors ${
                    selected?.id_inscripcion === i.id_inscripcion ? 'bg-violet-50' : ''
                  }`}
                  >
                    <td className="px-6 py-4 font-semibold text-gray-800">{i.nombre} {i.apellidos}</td>
                    <td className="px-6 py-4 text-gray-500">{i.cedula}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(i.fecha_solicitud).toLocaleDateString('es-CO')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ESTADO_BADGE[i.estado]}`}>
                        {i.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <ChevronRight size={16} className="text-gray-300" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Paginación */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-400">
              Mostrando {solicitudes.length === 0 ? 0 : inicio + 1} a {Math.min(inicio + POR_PAGINA, solicitudes.length)} de {solicitudes.length} solicitudes
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPagina(p => Math.max(1, p - 1))}
                disabled={pagina === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-sm text-gray-400 hover:bg-gray-100 disabled:opacity-30 transition-colors"
              >‹</button>
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPagina(p)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    p === pagina ? 'bg-violet-600 text-white' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
                disabled={pagina === totalPaginas || totalPaginas === 0}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-sm text-gray-400 hover:bg-gray-100 disabled:opacity-30 transition-colors"
              >›</button>
            </div>
          </div>
        </div>

        {/* Drawer */}
        {drawerOpen && (
          <div className="w-80 bg-white rounded-2xl border border-gray-700 overflow-y-auto flex-shrink-0">
            {loadingDetail ? (
              <div className="flex items-center justify-center h-40 text-gray-400 text-sm">Cargando...</div>
            ) : selected ? (
              <div className="p-5">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h2 className="text-base font-bold text-gray-800">{selected.nombre} {selected.apellidos}</h2>
                    <p className="text-sm text-gray-400 mt-0.5">CC {selected.cedula}</p>
                  </div>
                  <button
                    onClick={() => { setDrawerOpen(false); setSelected(null) }}
                    className="text-gray-300 hover:text-gray-500 transition"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  <InfoRow icon={<Mail size={15} />} label="Correo institucional" value={selected.correo_institucional} />
                  {selected.correo_personal && (
                    <InfoRow icon={<Mail size={15} />} label="Correo personal" value={selected.correo_personal} />
                  )}
                  <InfoRow icon={<CreditCard size={15} />} label="Género" value={selected.genero} />
                  <InfoRow icon={<MapPin size={15} />} label="Origen" value={selected.lugar_origen} />
                  <InfoRow icon={<MapPin size={15} />} label="Residencia actual" value={selected.lugar_residencia} />
                  <InfoRow icon={<Truck size={15} />} label="Medio de transporte" value={selected.medio_transporte} />
                  <InfoRow icon={<Users size={15} />} label="Ocupación de padres" value={selected.ocupacion_padres} />

                  {/* Días de asistencia */}
                  <div className="flex items-start gap-3">
                    <span className="text-gray-300 mt-0.5 flex-shrink-0"><Calendar size={15} /></span>
                    <div className="w-full">
                      <p className="text-xs text-gray-400 mb-2">Días de asistencia</p>
                      <div className="flex flex-col gap-1.5">
                        {DIAS_SEMANA.map(dia => {
                          const diasOriginales = selected.dias_semana
                            ? selected.dias_semana.split(',').map(d => d.trim())
                            : []
                          const esOriginal = diasOriginales.includes(dia)
                          const esPendiente = selected.estado === 'PENDIENTE'
                          return (
                            <label key={dia} className={`flex items-center gap-2 ${esOriginal && esPendiente ? 'cursor-pointer' : 'cursor-default'}`}>
                              <input
                                type="checkbox"
                                checked={diasSeleccionados.includes(dia)}
                                onChange={(e) => {
                                  if (!esOriginal || !esPendiente) return
                                  if (e.target.checked) setDiasSeleccionados(prev => [...prev, dia])
                                  else setDiasSeleccionados(prev => prev.filter(d => d !== dia))
                                }}
                                disabled={!esOriginal || !esPendiente}
                                className="accent-violet-500"
                              />
                              <span className={`text-sm ${esOriginal ? 'text-gray-700 font-medium' : 'text-gray-300'}`}>
                                {dia}
                              </span>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Documentos */}
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Documentos</p>
                    <div className="flex flex-col gap-2">
                      <a href={selected.sisben_url} target="_blank" rel="noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl hover:bg-violet-50 hover:text-violet-600 transition text-sm text-gray-600 border border-gray-100">
                        <FileText size={15} className="text-violet-400" /> Ver PDF SISBEN
                      </a>
                      <a href={selected.cedula_url} target="_blank" rel="noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl hover:bg-violet-50 hover:text-violet-600 transition text-sm text-gray-600 border border-gray-100">
                        <FileText size={15} className="text-violet-400" /> Ver PDF Cédula
                      </a>
                    </div>
                  </div>

                  {/* Botones */}
                  {selected.estado === 'PENDIENTE' && (
                    <div className="flex gap-3 pt-2">
                      <button onClick={handleRechazar}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-red-200 text-red-500 rounded-xl text-sm font-semibold hover:bg-red-50 transition">
                        <XCircle size={15} /> Rechazar
                      </button>
                      <button onClick={handleAprobar}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-violet-600 to-purple-500 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition">
                        <CheckCircle size={15} /> Aprobar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}

export default SolicitudesPage
