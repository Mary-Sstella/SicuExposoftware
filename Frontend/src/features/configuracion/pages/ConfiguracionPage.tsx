import { useState, useEffect } from 'react'
import { Settings, Calendar, Users, Clock, ToggleLeft, ToggleRight, Loader2, Check, AlertCircle } from 'lucide-react'
import {
  getConfiguracion, updateConfiguracion,
  getConfiguracionTurnos, updateConfiguracionTurno,
  type ConfiguracionTurno,
} from '../services/configuracionService'

const DIAS = [
  { key: 'cupo_lunes',     label: 'Lunes' },
  { key: 'cupo_martes',    label: 'Martes' },
  { key: 'cupo_miercoles', label: 'Miércoles' },
  { key: 'cupo_jueves',    label: 'Jueves' },
  { key: 'cupo_viernes',   label: 'Viernes' },
]

const inputClass = 'w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-violet-200'

function ConfiguracionPage() {
  const [turnos, setTurnos] = useState<ConfiguracionTurno[]>([])
  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [guardado, setGuardado] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    activo: false,
    fecha_inicio: '',
    fecha_fin: '',
    fecha_fin_semestre: '',
    cupo_lunes: 0,
    cupo_martes: 0,
    cupo_miercoles: 0,
    cupo_jueves: 0,
    cupo_viernes: 0,
    precio_comida: 0,
  })
  const [totalTurnos, setTotalTurnos] = useState(0)

  useEffect(() => { // Carga inicial de configuración y turnos
    const fetchAll = async () => {
      try {
        const [cfg, trns] = await Promise.all([getConfiguracion(), getConfiguracionTurnos()])
        setTurnos(trns)
        setForm({
          activo: cfg.activo,
          fecha_inicio: cfg.fecha_inicio ? cfg.fecha_inicio.split('T')[0] : '',
          fecha_fin: cfg.fecha_fin ? cfg.fecha_fin.split('T')[0] : '',
          fecha_fin_semestre: cfg.fecha_fin_semestre ? cfg.fecha_fin_semestre.split('T')[0] : '',
          cupo_lunes: cfg.cupo_lunes,
          cupo_martes: cfg.cupo_martes,
          cupo_miercoles: cfg.cupo_miercoles,
          cupo_jueves: cfg.cupo_jueves,
          cupo_viernes: cfg.cupo_viernes,
          precio_comida: Number(cfg.precio_comida),
        })
        setTotalTurnos(trns.reduce((sum, t) => sum + t.capacidad_maxima, 0))
      } catch {
        setError('No se pudo cargar la configuración')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const capacidadPorTurno = turnos.length > 0 ? Math.floor(totalTurnos / turnos.length) : 0

  const handleGuardar = async () => {
    setGuardando(true)
    setError(null)
    try {
      await updateConfiguracion({
        ...form,
        fecha_inicio: form.fecha_inicio ? form.fecha_inicio + 'T00:00:00.000Z' : null,
        fecha_fin: form.fecha_fin ? form.fecha_fin + 'T00:00:00.000Z' : null,
        fecha_fin_semestre: form.fecha_fin_semestre ? form.fecha_fin_semestre + 'T00:00:00.000Z' : null,
      })
      await Promise.all(
        turnos.map(t => updateConfiguracionTurno(t.id_configuracion, capacidadPorTurno))
      )
      setGuardado(true)
      setTimeout(() => setGuardado(false), 3000)
    } catch {
      setError('Error al guardar los cambios')
    } finally {
      setGuardando(false)
    }
  }

  if (loading) return (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <Loader2 size={24} className="animate-spin text-violet-400" />
    </div>
  )

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-gray-50">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-400 rounded-2xl flex items-center justify-center shadow-md">
            <Settings size={26} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Configuración</h1>
            <p className="text-sm text-gray-400">Ajustes generales del sistema</p>
          </div>
        </div>
        <button onClick={handleGuardar} disabled={guardando}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-violet-500 to-purple-400 text-white text-sm font-semibold rounded-2xl hover:opacity-90 transition disabled:opacity-50 shadow-md">
          {guardando
            ? <><Loader2 size={15} className="animate-spin" /> Guardando...</>
            : guardado
            ? <><Check size={15} /> ¡Guardado!</>
            : 'Guardar cambios'}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 mb-6 px-4 py-3 bg-red-50 rounded-2xl text-sm text-red-500">
          <AlertCircle size={15} /> {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-6 items-start">

        {/* Periodo activo */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center">
              <Calendar size={18} className="text-violet-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-800">Periodo activo</h2>
              <p className="text-xs text-gray-400">Fechas del comedor universitario</p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Inicio del comedor</label>
              <input type="date" value={form.fecha_inicio}
                onChange={e => setForm(f => ({ ...f, fecha_inicio: e.target.value }))}
                className={`mt-1.5 ${inputClass}`} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Fin del semestre</label>
              <input type="date" value={form.fecha_fin_semestre}
                onChange={e => setForm(f => ({ ...f, fecha_fin_semestre: e.target.value }))}
                className={`mt-1.5 ${inputClass}`} />
            </div>
          </div>
        </div>

        {/* Cupos por día */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center">
              <Users size={18} className="text-violet-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-800">Cupos por día</h2>
              <p className="text-xs text-gray-400">Máximo de estudiantes por día</p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {DIAS.map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between gap-4">
                <span className="text-sm text-gray-600 w-24">{label}</span>
                <input type="number" min={0}
                  value={form[key as keyof typeof form] as number}
                  onChange={e => setForm(f => ({ ...f, [key]: parseInt(e.target.value) || 0 }))}
                  className="w-28 px-3 py-1.5 rounded-xl border border-gray-200 text-sm text-gray-700 text-center outline-none focus:ring-2 focus:ring-violet-200" />
              </div>
            ))}
          </div>
        </div>

        {/* Límite de turnos */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center">
              <Clock size={18} className="text-violet-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-800">Límite de turnos</h2>
              <p className="text-xs text-gray-400">Se divide en {turnos.length} rangos horarios iguales</p>
            </div>
          </div>
          <div className="mb-4">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Total de turnos por día</label>
            <input type="number" min={0}
              value={totalTurnos}
              onChange={e => setTotalTurnos(parseInt(e.target.value) || 0)}
              className={`mt-1.5 ${inputClass}`} />
          </div>
          <div className="flex flex-col gap-2">
            {turnos.map((t, i) => (
              <div key={t.id_configuracion} className="flex items-center justify-between px-3 py-2.5 bg-gray-50 rounded-xl">
                <span className="text-xs text-gray-500">Turno {i + 1} &nbsp;·&nbsp; {t.hora_inicio} – {t.hora_fin}</span>
                <span className="text-xs font-bold text-violet-600">{capacidadPorTurno} estudiantes</span>
              </div>
            ))}
          </div>
        </div>

        {/* Registro público */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center">
              <Settings size={18} className="text-violet-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-800">Registro público</h2>
              <p className="text-xs text-gray-400">Controla el botón "Registrarse" del inicio</p>
            </div>
          </div>
          <button
            onClick={() => setForm(f => ({ ...f, activo: !f.activo }))}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border-2 transition-all ${
              form.activo
                ? 'border-violet-300 bg-violet-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div>
              <p className={`text-sm font-semibold ${form.activo ? 'text-violet-700' : 'text-gray-500'}`}>
                {form.activo ? 'Registro habilitado' : 'Registro deshabilitado'}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {form.activo
                  ? 'Los estudiantes pueden enviar solicitudes'
                  : 'El botón de registro está oculto'}
              </p>
            </div>
            {form.activo
              ? <ToggleRight size={32} className="text-violet-500 shrink-0" />
              : <ToggleLeft size={32} className="text-gray-300 shrink-0" />}
          </button>
        </div>

      </div>
    </div>
  )
}

export default ConfiguracionPage
