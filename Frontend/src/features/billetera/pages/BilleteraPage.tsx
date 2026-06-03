import { useState } from 'react'
import { Wallet, Plus, FileText, CheckCircle, Clock, XCircle, Loader2, CreditCard } from 'lucide-react'
import SubirPagoModal from '../components/SubirPagoModal'
import { useMisPagos } from '../hooks/useMisPagos'
import { getPdfUrl } from '../services/billeteraService'

const DIA_LABEL: Record<string, string> = {
  lunes: 'Lunes', martes: 'Martes', miercoles: 'Miércoles', jueves: 'Jueves', viernes: 'Viernes',
}

const ESTADO_CONFIG = {
  APROBADO:  { icon: CheckCircle, color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200', label: 'Aprobado',  dot: 'bg-green-500' },
  PENDIENTE: { icon: Clock,       color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-200', label: 'Pendiente', dot: 'bg-amber-500' },
  RECHAZADO: { icon: XCircle,     color: 'text-red-500',    bg: 'bg-red-50',    border: 'border-red-200',   label: 'Rechazado', dot: 'bg-red-500'   },
}

type Filtro = 'TODOS' | 'PENDIENTE' | 'APROBADO' | 'RECHAZADO'

function BilleteraPage() {
  const [modalAbierto, setModalAbierto] = useState(false)
  const [pdfCargando, setPdfCargando] = useState<number | null>(null)
  const [filtro, setFiltro] = useState<Filtro>('TODOS')
  const { pagos, saldo, diasRegistrados, loading, error, refetch } = useMisPagos()

  const handleVerPdf = async (id_pago: number) => {
    setPdfCargando(id_pago)
    try {
      const url = await getPdfUrl(id_pago)
      window.open(url, '_blank')
    } finally {
      setPdfCargando(null)
    }
  }

  const pendientes = pagos.filter(p => p.estado === 'PENDIENTE').length
  const aprobados  = pagos.filter(p => p.estado === 'APROBADO').length
  const rechazados = pagos.filter(p => p.estado === 'RECHAZADO').length
  const pagosFiltrados = filtro === 'TODOS' ? pagos : pagos.filter(p => p.estado === filtro)

  if (loading) return (
    <div className="flex-1 flex items-center justify-center bg-slate-100">
      <Loader2 size={24} className="animate-spin text-violet-400" />
    </div>
  )

  if (error) return (
    <div className="flex-1 p-8 bg-slate-100">
      <p className="text-sm text-red-500">{error}</p>
    </div>
  )

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-slate-100">

      {/* Header */}
      <div className="flex items-center justify-between mb-4 md:mb-6 gap-3">
        <div>
          <h1 className="text-base font-semibold text-gray-700">Mi Billetera</h1>
          <p className="text-xs text-gray-400 hidden sm:block">Historial y estado de tus comprobantes de pago</p>
        </div>
        <button
          onClick={() => setModalAbierto(true)}
          className="flex items-center gap-1.5 px-3 py-2 md:px-4 bg-violet-600 hover:bg-violet-700 text-white text-xs md:text-sm font-semibold rounded-xl transition shadow-sm flex-shrink-0"
        >
          <Plus size={14} />
          <span className="hidden sm:inline">Subir comprobante</span>
          <span className="sm:hidden">Subir</span>
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="bg-white rounded-2xl p-3 md:p-5 shadow-sm md:shadow-md border border-gray-700 flex items-center gap-3 md:gap-4">
          <div className="w-9 h-9 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center flex-shrink-0">
            <Wallet size={18} className="text-white" />
          </div>
          <div>
            <p className="text-xl md:text-2xl font-bold text-gray-800">{saldo}</p>
            <p className="text-xs text-gray-500">Almuerzos disponibles</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-3 md:p-5 shadow-sm md:shadow-md border border-gray-700 flex items-center gap-3 md:gap-4">
          <div className="w-9 h-9 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-amber-400 to-orange-300 flex items-center justify-center flex-shrink-0">
            <Clock size={18} className="text-white" />
          </div>
          <div>
            <p className="text-xl md:text-2xl font-bold text-gray-800">{pendientes}</p>
            <p className="text-xs text-gray-500">Pendientes</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-3 md:p-5 shadow-sm md:shadow-md border border-gray-700 flex items-center gap-3 md:gap-4">
          <div className="w-9 h-9 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center flex-shrink-0">
            <CheckCircle size={18} className="text-white" />
          </div>
          <div>
            <p className="text-xl md:text-2xl font-bold text-gray-800">{aprobados}</p>
            <p className="text-xs text-gray-500">Aprobados</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-3 md:p-5 shadow-sm md:shadow-md border border-gray-700 flex items-center gap-3 md:gap-4">
          <div className="w-9 h-9 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-red-500 to-rose-400 flex items-center justify-center flex-shrink-0">
            <XCircle size={18} className="text-white" />
          </div>
          <div>
            <p className="text-xl md:text-2xl font-bold text-gray-800">{rechazados}</p>
            <p className="text-xs text-gray-500">Rechazados</p>
          </div>
        </div>
      </div>

      {/* Tabla con filtros */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-700 overflow-hidden">

        {/* Tabs */}
        <div className="flex items-center gap-1 flex-wrap px-4 py-3 md:px-5 md:py-4 border-b border-gray-100">
          {(['TODOS', 'PENDIENTE', 'APROBADO', 'RECHAZADO'] as Filtro[]).map(f => {
            const count = f === 'PENDIENTE' ? pendientes : f === 'APROBADO' ? aprobados : rechazados
            return (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  filtro === f ? 'bg-violet-600 text-white shadow-sm' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                }`}
              >
                {f === 'TODOS' ? 'Todos' : ESTADO_CONFIG[f].label}
                {f !== 'TODOS' && (
                  <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                    filtro === f ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Lista */}
        <div className="divide-y divide-gray-50">
          {pagosFiltrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center">
                <CreditCard size={22} className="text-gray-300" />
              </div>
              <p className="text-sm text-gray-400">
                {filtro === 'TODOS'
                  ? 'Aún no tienes comprobantes registrados'
                  : `No tienes comprobantes ${ESTADO_CONFIG[filtro].label.toLowerCase()}s`}
              </p>
            </div>
          ) : (
            pagosFiltrados.map(pago => {
              const { icon: Icon, color, bg, border, label, dot } = ESTADO_CONFIG[pago.estado as keyof typeof ESTADO_CONFIG]
              return (
                <div key={pago.id_pago} className="px-4 py-3 md:px-5 md:py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">

                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={18} className={color} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-gray-700">
                            {pago.tipo_periodo === 'SEMANAL' ? 'Pago semanal' : 'Pago mensual'}
                          </span>
                          <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${bg} ${color} ${border}`}>
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
                            {label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="text-xs text-gray-400">
                            {new Date(pago.fecha_subida).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                          <span className="text-xs text-gray-300">·</span>
                          <span className="text-xs text-gray-500">
                            <span className="font-semibold text-gray-700">{pago.cantidad_almuerzos}</span> almuerzos
                          </span>
                          {pago.estado === 'APROBADO' && (
                            <>
                              <span className="text-xs text-gray-300">·</span>
                              <span className="text-xs text-violet-600 font-semibold">
                                {pago.cantidad_almuerzos - pago.almuerzos_usados} disponibles
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="flex flex-wrap gap-1 justify-end">
                        {pago.dias_pagados.map(dia => (
                          <span key={dia} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-lg">
                            {DIA_LABEL[dia] ?? dia}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => handleVerPdf(pago.id_pago)}
                        disabled={pdfCargando === pago.id_pago}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-xl text-xs text-gray-500 hover:text-violet-600 hover:border-violet-200 font-medium transition-colors disabled:opacity-50"
                      >
                        {pdfCargando === pago.id_pago
                          ? <Loader2 size={13} className="animate-spin" />
                          : <FileText size={13} />}
                        PDF
                      </button>
                    </div>
                  </div>

                  {pago.estado === 'RECHAZADO' && pago.observacion && (
                    <div className="mt-3 px-3 py-2 bg-red-50 border border-red-100 rounded-xl text-xs text-red-500">
                      <span className="font-semibold">Motivo: </span>{pago.observacion}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
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