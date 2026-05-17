import { useState, useMemo } from 'react'
import { X, Upload, Calendar, AlertCircle } from 'lucide-react'

interface Props {
  diasRegistrados: string[]
  onClose: () => void
}

const DIA_A_NUM: Record<string, number> = {
  Lunes: 1, Martes: 2, 'Miércoles': 3, Jueves: 4, Viernes: 5,
}

const MESES = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']

function getProximasFechas(dias: string[]): { label: string; iso: string }[] {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const resultado: { label: string; iso: string }[] = []

  for (let w = 0; w <= 3; w++) {
    for (const dia of dias) {
      const numDia = DIA_A_NUM[dia]
      if (!numDia) continue
      const fecha = new Date(hoy)
      const hoyNum = hoy.getDay()
      let diff = numDia - hoyNum
      if (diff <= 0) diff += 7
      fecha.setDate(hoy.getDate() + diff + w * 7)
      const label = `${dia} ${fecha.getDate()} ${MESES[fecha.getMonth()]}`
      const iso = fecha.toISOString().split('T')[0]
      resultado.push({ label, iso })
    }
  }

  return resultado.sort((a, b) => a.iso.localeCompare(b.iso))
}

function SubirPagoModal({ diasRegistrados, onClose }: Props) {
  const [tipo, setTipo] = useState<'SEMANAL' | 'MENSUAL'>('SEMANAL')
  const [seleccionados, setSeleccionados] = useState<string[]>([])
  const [archivo, setArchivo] = useState<File | null>(null)
  const [arrastrado, setArrastrado] = useState(false)

  const fechas = useMemo(() => getProximasFechas(diasRegistrados), [diasRegistrados])
  const minimo = tipo === 'SEMANAL' ? 2 : 8
  const cantidad = seleccionados.length
  const cumpleMinimo = cantidad >= minimo

  const toggleDia = (iso: string) => {
    setSeleccionados(prev =>
      prev.includes(iso) ? prev.filter(d => d !== iso) : [...prev, iso]
    )
  }

  const handleArchivo = (file: File) => {
    if (file.type === 'application/pdf') setArchivo(file)
  }

  const handleSubmit = () => {
    if (!cumpleMinimo || !archivo) return
    // aquí irá la llamada al backend
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-800">Subir comprobante</h2>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-500 transition">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">

          {/* Tipo de periodo */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Tipo de periodo</p>
            <div className="flex gap-2">
              {(['SEMANAL', 'MENSUAL'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => { setTipo(t); setSeleccionados([]) }}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                    tipo === t
                      ? 'bg-violet-500 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {t === 'SEMANAL' ? 'Semanal' : 'Mensual'}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1.5">
              Mínimo <span className="font-semibold text-violet-500">{minimo} almuerzos</span> para periodo {tipo === 'SEMANAL' ? 'semanal' : 'mensual'}
            </p>
          </div>

          {/* Selección de días */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                <Calendar size={13} /> Días a pagar
              </p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                cumpleMinimo ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                {cantidad} seleccionado{cantidad !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
              {fechas.map(({ label, iso }) => (
                <label key={iso} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={seleccionados.includes(iso)}
                    onChange={() => toggleDia(iso)}
                    className="accent-violet-500 w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
            {!cumpleMinimo && cantidad > 0 && (
              <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-500">
                <AlertCircle size={12} />
                Debes seleccionar al menos {minimo} días para periodo {tipo === 'SEMANAL' ? 'semanal' : 'mensual'}
              </div>
            )}
          </div>

          {/* Subir PDF */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Comprobante PDF</p>
            <div
              onDragOver={(e) => { e.preventDefault(); setArrastrado(true) }}
              onDragLeave={() => setArrastrado(false)}
              onDrop={(e) => { e.preventDefault(); setArrastrado(false); const f = e.dataTransfer.files[0]; if (f) handleArchivo(f) }}
              onClick={() => document.getElementById('pdf-input')?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center gap-2 cursor-pointer transition-all ${
                arrastrado ? 'border-violet-400 bg-violet-50' :
                archivo ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-violet-300 hover:bg-gray-50'
              }`}
            >
              <Upload size={24} className={archivo ? 'text-green-500' : 'text-gray-300'} />
              {archivo ? (
                <p className="text-sm text-green-600 font-medium text-center">{archivo.name}</p>
              ) : (
                <>
                  <p className="text-sm text-gray-400 text-center">Arrastra el PDF aquí o haz clic para seleccionar</p>
                  <p className="text-xs text-gray-300">Solo archivos PDF</p>
                </>
              )}
            </div>
            <input id="pdf-input" type="file" accept="application/pdf" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleArchivo(f) }} />
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-1">
            <button onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 text-gray-500 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={!cumpleMinimo || !archivo}
              className="flex-1 py-2.5 bg-gradient-to-br from-violet-500 to-purple-400 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed">
              Enviar pago
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default SubirPagoModal
