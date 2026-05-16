import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, FileText, ChevronRight, X, Calendar, MapPin, Truck, Users, Mail, CreditCard } from 'lucide-react'
import { getInscripciones, getInscripcionById, aprobarInscripcion, rechazarInscripcion } from '../inscripcion/services/inscripcionesService'


type Solicitudes = {
    id_inscripcion: number,
    nombre: string,
    apellidos: string,
    cedula: string,
    estado: string,
    fecha_solicitud: string
}


type SolicitudDetalle = Solicitudes &{
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

const ESTADO_BADGE: Record<string, string> = {
    'PENDIENTE': 'bg-yellow-100 text-yellow-800',
    'APROBADO': 'bg-green-100 text-green-800',
    'RECHAZADO': 'bg-red-100 text-red-800',
}

function SolicitudesPage(){
    const [solicitudes, setSolicitudes] = useState<Solicitudes[]>([])
    const [selected, setSelected] = useState<SolicitudDetalle | null>(null)
    const [loadingList, setLoadingList] = useState(true)
    const [loadingDetail, setLoadingDetail] = useState(false)
    const [drawerOpen, setDrawerOpen] = useState(false) //estado para controlar el menu lateral

    useEffect(()=>{fetchSolicitudes()}, [])

    const fetchSolicitudes = async ()=>{
        try{
            const data = await getInscripciones()
            setSolicitudes(data)
        }finally{
            setLoadingList(false)
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



    const handleSelect = async (id: number)=>{
        setDrawerOpen(true)
        setLoadingDetail(true)
        try{
            const data = await getInscripcionById(id)
            setSelected(data)
        }finally{
            setLoadingDetail(false)
        }
    }

    const handleAprobar = async () =>{
        if(!selected) return
        if(!confirm('¿Aprobar esta solicitud? El estudiante será registrado en el sistema.')) return
        await aprobarInscripcion(selected.id_inscripcion)
        setDrawerOpen(false)
        setSelected(null)
        fetchSolicitudes()
    }

      return (
    <div className="flex-1 p-8 bg-gray-50 overflow-hidden flex flex-col">

      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">Pre-inscritos</h1>
        <p className="text-sm text-gray-400 mt-0.5">Solicitudes de inscripción pendientes de revisión</p>
      </div>

      <div className="flex gap-6 flex-1 overflow-hidden">

        {/* Tabla */}
        <div className={`bg-white rounded-2xl shadow-sm overflow-auto flex flex-col transition-all duration-300 ${drawerOpen ? 'flex-1' : 'w-full'}`}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Nombre</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Cédula</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Fecha solicitud</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Estado</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody>
              {loadingList ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-400">Cargando...</td></tr>
              ) : solicitudes.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-400">No hay solicitudes</td></tr>
              ) : (
                solicitudes.map(i => (
                  <tr key={i.id_inscripcion}
                    onClick={() => handleSelect(i.id_inscripcion)}
                    className={`border-b border-gray-50 cursor-pointer hover:bg-purple-50 transition-colors
                      ${selected?.id_inscripcion === i.id_inscripcion ? 'bg-purple-50' : ''}`}>
                    <td className="px-6 py-4 font-medium text-gray-700">{i.nombre} {i.apellidos}</td>
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
        </div>

        {/* Drawer */}
        {drawerOpen && (
          <div className="w-96 bg-white rounded-2xl shadow-sm overflow-y-auto flex-shrink-0">
            {loadingDetail ? (
              <div className="flex items-center justify-center h-40 text-gray-400 text-sm">Cargando detalle...</div>
            ) : selected ? (
              <div className="p-6">

                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-base font-bold text-gray-800">{selected.nombre} {selected.apellidos}</h2>
                    <p className="text-xs text-gray-400 mt-0.5">CC {selected.cedula}</p>
                  </div>
                  <button onClick={() => { setDrawerOpen(false); setSelected(null) }}
                    className="text-gray-300 hover:text-gray-500 transition">
                    <X size={18} />
                  </button>
                </div>

                <div className="flex flex-col gap-4 mb-6">
                  <InfoRow icon={<Mail size={14} />} label="Correo institucional" value={selected.correo_institucional} />
                  {selected.correo_personal && <InfoRow icon={<Mail size={14} />} label="Correo personal" value={selected.correo_personal} />}
                  <InfoRow icon={<CreditCard size={14} />} label="Género" value={selected.genero} />
                  <InfoRow icon={<MapPin size={14} />} label="Origen" value={selected.lugar_origen} />
                  <InfoRow icon={<MapPin size={14} />} label="Residencia actual" value={selected.lugar_residencia} />
                  <InfoRow icon={<Truck size={14} />} label="Medio de transporte" value={selected.medio_transporte} />
                  <InfoRow icon={<Users size={14} />} label="Ocupación de padres" value={selected.ocupacion_padres} />
                  <InfoRow icon={<Calendar size={14} />} label="Días de asistencia" value={selected.dias_semana} />
                </div>

                <div className="mb-6">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Documentos</p>
                  <div className="flex flex-col gap-2">
                    <a href={selected.sisben_url} target="_blank" rel="noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-xl hover:bg-purple-50 hover:text-violet-600 transition text-sm text-gray-600">
                      <FileText size={16} className="text-violet-400" />
                      Ver PDF SISBEN
                    </a>
                    <a href={selected.cedula_url} target="_blank" rel="noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-xl hover:bg-purple-50 hover:text-violet-600 transition text-sm text-gray-600">
                      <FileText size={16} className="text-violet-400" />
                      Ver PDF Cédula
                    </a>
                  </div>
                </div>

                {selected.estado === 'PENDIENTE' && (
                  <div className="flex gap-3">
                    <button onClick={handleRechazar}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-red-200 text-red-500 rounded-xl text-sm font-semibold hover:bg-red-50 transition">
                      <XCircle size={16} />
                      Rechazar
                    </button>
                    <button onClick={handleAprobar}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition">
                      <CheckCircle size={16} />
                      Aprobar
                    </button>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-violet-400 mt-0.5 flex-shrink-0">{icon}</span>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm text-gray-700 font-medium">{value}</p>
      </div>
    </div>
  )
}

export default SolicitudesPage
