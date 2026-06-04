import { useState, useMemo, useEffect } from 'react'
import { X, Upload, Calendar, AlertCircle, Loader2 } from 'lucide-react'
import { useAuthStore } from '../../../features/auth/store/authStore'
import { crearPago } from '../services/billeteraService'
import api from '../../../shared/api/axios'

interface Props {
  diasRegistrados: string[]
  onClose: () => void
  onSuccess: () => void
}

const DIA_A_NUM: Record<string, number> = {
  lunes: 1, martes: 2, miercoles: 3, jueves: 4, viernes: 5,
}

const DIA_A_LABEL: Record<string, string> = {
  lunes: 'Lunes', martes: 'Martes', miercoles: 'Miércoles', jueves: 'Jueves', viernes: 'Viernes',
}

const MESES = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']

function getProximasFechas(
  dias: string[],
  fechaInicio: string | null,
  fechaFin: string | null
): { label: string; iso: string; dia: string }[] {
  const hoy = new Date()
  hoy.setHours(12, 0, 0, 0)

  const inicio = fechaInicio ? new Date(fechaInicio + 'T12:00:00') : hoy
  const fin = fechaFin
    ? new Date(fechaFin + 'T12:00:00')
    : new Date(hoy.getTime() + 28 * 24 * 60 * 60 * 1000)

  const desde = inicio > hoy ? inicio : hoy
  const current = new Date(desde)
  const resultado: { label: string; iso: string; dia: string }[] = []

  for (let i = 0; i < 365; i++) {
    if (current > fin) break
    const diaSemana = current.getDay()
    const diaName = Object.keys(DIA_A_NUM).find(k => DIA_A_NUM[k] === diaSemana)
    if (diaName && dias.includes(diaName)) {
      const label = `${DIA_A_LABEL[diaName]} ${current.getDate()} ${MESES[current.getMonth()]}`
      const iso = current.toISOString().split('T')[0]
      resultado.push({ label, iso, dia: diaName })
    }
    current.setDate(current.getDate() + 1)
  }

  return resultado
}

function SubirPagoModal({ diasRegistrados, onClose, onSuccess }: Props) {
  const [tipo, setTipo] = useState<'SEMANAL' | 'MENSUAL'>('SEMANAL')
  const [seleccionados, setSeleccionados] = useState<string[]>([])
  const [archivo, setArchivo] = useState<File | null>(null)
  const [arrastrado, setArrastrado] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null)
  const [fechaInicio, setFechaInicio] = useState<string | null>(null)
  const [fechaFin, setFechaFin] = useState<string | null>(null)
  const { id_estudiante } = useAuthStore()
  const [fechasPagadas, setFechasPagadas] = useState<string[]>([])
  const [precioPorAlmuerzo, setPrecioPorAlmuerzo] = useState(0)
  const [montoEstudiante, setMontoEstudiante] = useState('')

useEffect(() => {
  if (id_estudiante) {
    api.get(`/turnos/estudiante/${id_estudiante}/fechas-pagadas`)
      .then(res => setFechasPagadas(res.data))
      .catch(() => {})
  }
}, [id_estudiante])


 

useEffect(() => {
  api.get('/configuracion-formulario').then(res => {
    const cfg = res.data
    if (cfg.fecha_inicio) setFechaInicio(cfg.fecha_inicio.split('T')[0])
    if (cfg.fecha_fin_semestre) setFechaFin(cfg.fecha_fin_semestre.split('T')[0])
    if (cfg.precio_comida) setPrecioPorAlmuerzo(Number(cfg.precio_comida))
  }).catch(() => {})
}, [])


  const fechas = useMemo(() => getProximasFechas(diasRegistrados, fechaInicio, fechaFin), [diasRegistrados, fechaInicio, fechaFin])
  const minimoBase = tipo === 'SEMANAL' ? 2 : 8
  const minimo = Math.min(minimoBase, diasRegistrados.length)
  const cantidad = seleccionados.length
  const cumpleMinimo = cantidad >= minimo
  const subtotal = cantidad * precioPorAlmuerzo
  const montoValido = montoEstudiante !== '' && Number(montoEstudiante) === subtotal


  const toggleDia = (iso: string) => {
    setSeleccionados(prev =>
      prev.includes(iso) ? prev.filter(d => d !== iso) : [...prev, iso]
    )
  }

  const handleArchivo = (file: File) => {
    if (file.type === 'application/pdf') setArchivo(file)
  }

    const handleSubmit = async () => {
    if (!cumpleMinimo || !archivo || enviando) return
    if (precioPorAlmuerzo > 0 && !montoValido) return
    setEnviando(true)
    setErrorEnvio(null)
    try {
      const diasNombres = seleccionados
        .map(iso => fechas.find(f => f.iso === iso)?.dia ?? '')
        .filter(Boolean)

      await crearPago({
        tipo_periodo: tipo,
        dias_pagados: diasNombres,
        archivo,
        monto_estudiante: precioPorAlmuerzo > 0 ? subtotal : undefined,
      })
      onSuccess()
      onClose()
    } catch (e: any) {
      setErrorEnvio(e?.response?.data?.msg ?? 'Error al enviar el pago')
    } finally {
      setEnviando(false)
    }
  }


  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-base font-bold text-gray-800 dark:text-white">Subir comprobante</h2>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-500 dark:hover:text-gray-400 transition">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">

          <div>
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">Tipo de periodo</p>
            <div className="flex gap-2">
              {(['SEMANAL', 'MENSUAL'] as const).map(t => (
                <button key={t} onClick={() => { setTipo(t); setSeleccionados([]) }}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                    tipo === t ? 'bg-violet-500 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}>
                  {t === 'SEMANAL' ? 'Semanal' : 'Mensual'}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
              Mínimo <span className="font-semibold text-violet-500">{minimo} almuerzos</span> para periodo {tipo === 'SEMANAL' ? 'semanal' : 'mensual'}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                <Calendar size={13} /> Días a pagar
              </p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                cumpleMinimo ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
              }`}>
                {cantidad} seleccionado{cantidad !== 1 ? 's' : ''}
              </span>
            </div>
            {diasRegistrados.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No tienes días asignados</p>
            ) : (
              <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
                {fechas.filter(f => !fechasPagadas.includes(f.iso)).map(({ label, iso }) => (
                  <label key={iso} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                    <input type="checkbox" checked={seleccionados.includes(iso)}
                      onChange={() => toggleDia(iso)} className="accent-violet-500 w-4 h-4" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                  </label>
                ))}
              </div>
            )}
            {!cumpleMinimo && cantidad > 0 && (
              <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-500">
                <AlertCircle size={12} />
                Debes seleccionar al menos {minimo} días para periodo {tipo === 'SEMANAL' ? 'semanal' : 'mensual'}
              </div>
            )}
          </div>
            {cantidad > 0 && precioPorAlmuerzo > 0 && (
            <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-900/40 rounded-2xl px-4 py-3 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {cantidad} almuerzo{cantidad !== 1 ? 's' : ''} × ${precioPorAlmuerzo.toLocaleString('es-CO')}
                </span>
                <span className="text-base font-black text-violet-700 dark:text-violet-400">
                  ${subtotal.toLocaleString('es-CO')}
                </span>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                  Monto que vas a pagar
                </label>
                <input
                  type="number"
                  min={0}
                  value={montoEstudiante}
                  onChange={e => setMontoEstudiante(e.target.value)}
                  placeholder={`Debe ser $${subtotal.toLocaleString('es-CO')}`}
                  className={`mt-1.5 w-full px-3 py-2 rounded-xl border text-sm outline-none focus:ring-2 transition ${
                    montoEstudiante === ''
                      ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-violet-200'
                      : montoValido
                      ? 'border-green-300 bg-green-50 dark:bg-green-900/20 focus:ring-green-200 text-green-700 dark:text-green-400'
                      : 'border-red-300 bg-red-50 dark:bg-red-900/20 focus:ring-red-200 text-red-600'
                  }`}
                />
                {montoEstudiante !== '' && !montoValido && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={11} /> El monto no coincide con el subtotal del sistema
                  </p>
                )}
              </div>
            </div>
          )}
          <div>
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">Comprobante PDF</p>
            <div
              onDragOver={(e) => { e.preventDefault(); setArrastrado(true) }}
              onDragLeave={() => setArrastrado(false)}
              onDrop={(e) => { e.preventDefault(); setArrastrado(false); const f = e.dataTransfer.files[0]; if (f) handleArchivo(f) }}
              onClick={() => document.getElementById('pdf-input')?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center gap-2 cursor-pointer transition-all ${
                arrastrado ? 'border-violet-400 bg-violet-50 dark:bg-violet-900/20' :
                archivo ? 'border-green-300 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-violet-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <Upload size={24} className={archivo ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'} />
              {archivo ? (
                <p className="text-sm text-green-600 font-medium text-center">{archivo.name}</p>
              ) : (
                <>
                  <p className="text-sm text-gray-400 dark:text-gray-500 text-center">Arrastra el PDF aquí o haz clic para seleccionar</p>
                  <p className="text-xs text-gray-300 dark:text-gray-600">Solo archivos PDF</p>
                </>
              )}
            </div>
            <input id="pdf-input" type="file" accept="application/pdf" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleArchivo(f) }} />
          </div>

          {errorEnvio && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 rounded-xl text-xs text-red-500">
              <AlertCircle size={13} /> {errorEnvio}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button onClick={onClose} disabled={enviando}
              className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-50">
              Cancelar
            </button>
            <button onClick={handleSubmit} disabled={!cumpleMinimo || !archivo || enviando || (precioPorAlmuerzo > 0 && !montoValido)}
              className="flex-1 py-2.5 bg-gradient-to-br from-violet-500 to-purple-400 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {enviando ? <><Loader2 size={15} className="animate-spin" /> Enviando...</> : 'Enviar pago'}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default SubirPagoModal
