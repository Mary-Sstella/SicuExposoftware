import { useState } from 'react'
import { Wallet, Plus, FileText, CheckCircle, Clock, XCircle } from 'lucide-react'
import SubirPagoModal from '../components/SubirPagoModal'

type Pago={
    id_pago: number;
    tipo_periodo: 'SEMANAL' | 'MENSUAL'
    dias_pagados: string[]
    cantidad_almuerzos: number
    almuerzos_usados: number
    estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO'
    pdf_url: string
    observacion?: string
    fecha_subida: string
}

const MOCK_DIAS_REGISTRADOS = ['Lunes', 'Miércoles', 'Viernes']

const MOCK_PAGOS: Pago[] = [
    {
         id_pago: 1,
         tipo_periodo: 'SEMANAL',
         dias_pagados: ['Lunes 19 may', 'Miércoles 21 may'],
         cantidad_almuerzos: 2,
         almuerzos_usados: 1,
         estado: 'APROBADO',
         pdf_url: '#',
         fecha_subida: '2025-05-15',
    },

    {
        id_pago: 2,
        tipo_periodo: 'SEMANAL',
        dias_pagados: ['Lunes 26 may', 'Miércoles 28 may', 'Viernes 30 may'],
        cantidad_almuerzos: 3,
        almuerzos_usados: 0,
        estado: 'PENDIENTE',
        pdf_url: '#',
        fecha_subida: '2025-05-17',
    },

    {
        id_pago: 3,
        tipo_periodo: 'SEMANAL',
        dias_pagados: ['Miércoles 7 may', 'Viernes 9 may'],
        cantidad_almuerzos: 2,
        almuerzos_usados: 0,
        estado: 'RECHAZADO',
        pdf_url: '#',
        observacion: 'El comprobante no corresponde al periodo indicado.',
        fecha_subida: '2025-05-06',
    }
]

const ESTADO_CONFIG = {
  APROBADO:  { icon: CheckCircle, color: 'text-green-600',  bg: 'bg-green-50',  label: 'Aprobado' },
  PENDIENTE: { icon: Clock,       color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Pendiente' },
  RECHAZADO: { icon: XCircle,     color: 'text-red-500',    bg: 'bg-red-50',    label: 'Rechazado' },
}

function BilleteraPage() {
    const [modalAbierto, setModalAbierto] = useState(false)

    const saldo = MOCK_PAGOS
    .filter(pago=> pago.estado === 'APROBADO')
    .reduce((sum,pago)=> sum + (pago.cantidad_almuerzos - pago.almuerzos_usados), 0)

    return(
        <div className="flex-1 p-8 overflow-y-auto bg-gray-50">

      {/* Header */}
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
        <button
          onClick={() => setModalAbierto(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-violet-500 via-violet-400 to-purple-300 hover:opacity-90 text-white text-sm font-semibold rounded-2xl transition-opacity shadow-md"
        >
          <Plus size={16} />
          Subir comprobante
        </button>
      </div>

      {/* Saldo */}
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

      {/* Lista de pagos */}
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Historial de pagos</h2>
        {MOCK_PAGOS.map(pago => {
          const { icon: Icon, color, bg, label } = ESTADO_CONFIG[pago.estado]
          return (
            <div key={pago.id_pago} className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 bg-violet-100 text-violet-600 rounded-lg">
                    {pago.tipo_periodo}
                  </span>
                  <span className="text-xs text-gray-400">{pago.fecha_subida}</span>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${bg} ${color}`}>
                  <Icon size={12} />
                  {label}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {pago.dias_pagados.map(dia => (
                  <span key={dia} className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg">
                    {dia}
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
                <a href={pago.pdf_url} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs text-violet-500 hover:text-violet-700 font-medium transition-colors">
                  <FileText size={13} />
                  Ver PDF
                </a>
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
          diasRegistrados={MOCK_DIAS_REGISTRADOS}
          onClose={() => setModalAbierto(false)}
        />
      )}
    </div>
  )
}

export default BilleteraPage