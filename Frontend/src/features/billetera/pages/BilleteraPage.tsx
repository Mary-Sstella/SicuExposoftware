import { useState } from 'react'
import { Wallet, Plus, FileText, CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react'
import SubirPagoModal from '../components/SubirPagoModal'
import { useMisPagos } from '../hooks/useMisPagos'
import { getPdfUrl } from '../services/billeteraService'

const DIA_LABEL: Record<string, string> = {
  lunes: 'Lunes', martes: 'Martes', miercoles: 'Miércoles', jueves: 'Jueves', viernes: 'Viernes',
}

const ESTADO_CONFIG = {
  APROBADO:  { icon: CheckCircle, color: 'text-green-600',  bg: 'bg-green-50',  label: 'Aprobado' },
  PENDIENTE: { icon: Clock,       color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Pendiente' },
  RECHAZADO: { icon: XCircle,     color: 'text-red-500',    bg: 'bg-red-50',    label: 'Rechazado' },
}

function BilleteraPage() {
  const [modalAbierto, setModalAbierto] = useState(false)
  const [pdfCargando, setPdfCargando] = useState<number | null>(null)
  const { pagos, saldo, diasRegistrados, loading, error, refetch } = useMisPagos()

  const handleVerPdf = async (id_pago: number) => {
    setPdfCargando(id_pago)
    try {
      const url = await getPdfUrl(id_pago)
      window.open(url, '_blank')
    } catch {
      /* silencioso por ahora */
    } finally {
      setPdfCargando(null)
    }
  }

  if (loading) return (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <Loader2 size={24} className="animate-spin text-violet-400" />
    </div>
  )

  if (error) return (
    <div className="flex-1 p-8 bg-gray-50">
      <p className="text-sm text-red-500">{error}</p>
    </div>
  )

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-gray-50">

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-400 rounded-2xl flex items-center justify-center shadow-md">
            <Wallet size={26} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Mi Billetera</h1>
            <p className="text-sm text-gray-400">Gestiona tus pagos de almuerzos</p>
          </div>
        </div>
        <button onClick={() => setModalAbierto(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-violet-500 via-violet-400 to-purple-300 hover:opacity-90 text-white text-sm font-semibold rounded-2xl transition-opacity shadow-md">
          <Plus size={16} />
          Subir comprobante
        </button>
      </div>

      <div className="bg-gradient-to-r from-violet-500 to-purple-400 rounded-2xl px-6 py-5 mb-6 shadow-md flex items-center justify-between">
        <div>
          <p className="text-white/70 text-sm mb-1">Almuerzos disponibles</p>
          <p className="text-white text-4xl font-bold">{saldo}</p>
          <p className="text-white/60 text-xs mt-1">de pagos aprobados</p>
        </div>
        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
          <Wallet size={32} className="text-white/80" />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Historial de pagos</h2>

        {pagos.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <p className="text-sm text-gray-400">Aún no tienes pagos registrados</p>
          </div>
        )}

        {pagos.map(pago => {
          const { icon: Icon, color, bg, label } = ESTADO_CONFIG[pago.estado]
          return (
            <div key={pago.id_pago} className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 bg-violet-100 text-violet-600 rounded-lg">
                    {pago.tipo_periodo}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(pago.fecha_subida).toLocaleDateString('es-CO')}
                  </span>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${bg} ${color}`}>
                  <Icon size={12} /> {label}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {pago.dias_pagados.map(dia => (
                  <span key={dia} className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg">
                    {DIA_LABEL[dia] ?? dia}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-400">
                    <span className="font-semibold text-gray-700">{pago.cantidad_almuerzos}</span> almuerzos pagados
                  </span>
                  {pago.estado === 'APROBADO' && (
                    <span className="text-xs text-gray-400">
                      <span className="font-semibold text-violet-600">{pago.cantidad_almuerzos - pago.almuerzos_usados}</span> disponibles
                    </span>
                  )}
                </div>
                <button onClick={() => handleVerPdf(pago.id_pago)} disabled={pdfCargando === pago.id_pago}
                  className="flex items-center gap-1.5 text-xs text-violet-500 hover:text-violet-700 font-medium transition-colors disabled:opacity-50">
                  {pdfCargando === pago.id_pago
                    ? <Loader2 size={13} className="animate-spin" />
                    : <FileText size={13} />}
                  Ver PDF
                </button>
              </div>

              {pago.estado === 'RECHAZADO' && pago.observacion && (
                <div className="mt-3 px-3 py-2 bg-red-50 rounded-xl text-xs text-red-500">
                  <span className="font-semibold">Motivo: </span>{pago.observacion}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {modalAbierto && (
        <SubirPagoModal
          diasRegistrados={diasRegistrados}
          onClose={() => setModalAbierto(false)}
          onSuccess={refetch}
        />
      )}
    </div>
  )
}

export default BilleteraPage
