import { useState, useEffect, useCallback } from 'react'
import {
  DndContext, DragOverlay,
  useDraggable, useDroppable,
  type DragEndEvent, type DragStartEvent,
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { FileText, CheckCircle, XCircle, Loader2, Wallet, ClipboardList } from 'lucide-react'
import { getPagos, actualizarEstadoPago, getPdfUrlAdmin, type PagoAdmin } from '../service/carteraService'

type Estado = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO'

const DIA_LABEL: Record<string, string> = {
  lunes: 'Lun', martes: 'Mar', miercoles: 'Mié', jueves: 'Jue', viernes: 'Vie',
}

const COL_CONFIG: Record<Estado, {
  dot: string; badge: string; ring: string; dropBg: string
}> = {
  PENDIENTE: { dot: 'bg-amber-400',  badge: 'border-amber-300 text-amber-600',  ring: 'ring-amber-200',  dropBg: 'bg-amber-50/60 dark:bg-amber-900/20' },
  APROBADO:  { dot: 'bg-green-400',  badge: 'border-green-300 text-green-600',  ring: 'ring-green-200',  dropBg: 'bg-green-50/60 dark:bg-green-900/20' },
  RECHAZADO: { dot: 'bg-red-400',    badge: 'border-red-300 text-red-500',      ring: 'ring-red-200',    dropBg: 'bg-red-50/60 dark:bg-red-900/20' },
}

const STAT_CONFIG = [
  {
    estado: 'PENDIENTE' as Estado,
    label: 'Pendiente',
    icon: <ClipboardList size={22} className="text-white" />,
    iconBg: 'bg-gradient-to-br from-amber-400 to-orange-400',
    cardBg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-800',
    count_text: 'text-amber-700 dark:text-amber-400',
  },
  {
    estado: 'APROBADO' as Estado,
    label: 'Aprobado',
    icon: <CheckCircle size={22} className="text-white" />,
    iconBg: 'bg-gradient-to-br from-green-400 to-emerald-500',
    cardBg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    count_text: 'text-green-700 dark:text-green-400',
  },
  {
    estado: 'RECHAZADO' as Estado,
    label: 'Rechazado',
    icon: <XCircle size={22} className="text-white" />,
    iconBg: 'bg-gradient-to-br from-red-400 to-rose-500',
    cardBg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    count_text: 'text-red-600 dark:text-red-400',
  },
]

function EmptyColumn() {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-3">
      <div className="w-16 h-16 rounded-2xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center">
        <Wallet size={30} className="text-violet-200 dark:text-violet-700" />
      </div>
      <p className="text-sm text-gray-300 dark:text-gray-600 font-medium">Sin comprobantes</p>
    </div>
  )
}

function CardPreview({ pago }: { pago: PagoAdmin }) {
  const initials = `${pago.estudiante.nombres[0] ?? ''}${pago.estudiante.apellidos[0] ?? ''}`.toUpperCase()
  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 w-72 rotate-1 opacity-95 border border-gray-200">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center text-white text-xs font-bold">
          {initials}
        </div>
        <p className="text-sm font-bold text-gray-800">{pago.estudiante.nombres} {pago.estudiante.apellidos}</p>
      </div>
      <div className="flex gap-1 flex-wrap">
        {pago.dias_pagados.map((d: string) => (
          <span key={d} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md">
            {DIA_LABEL[d] ?? d}
          </span>
        ))}
      </div>
    </div>
  )
}

function PagoCard({ pago, activeId, onPdf, pdfLoading, onAprobar, onRechazar }: {
  pago: PagoAdmin
  activeId: number | null
  onPdf: (id: number) => void
  pdfLoading: number | null
  onAprobar: (id: number) => void
  onRechazar: (id: number) => void
}) {
  const isPendiente = pago.estado === 'PENDIENTE'
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: String(pago.id_pago),
    disabled: !isPendiente,
  })
  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined
  const isBeingDragged = activeId === pago.id_pago
  const initials = `${pago.estudiante.nombres[0] ?? ''}${pago.estudiante.apellidos[0] ?? ''}`.toUpperCase()

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isPendiente ? { ...attributes, ...listeners } : {})}
      className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 select-none transition-opacity
        ${isPendiente ? 'cursor-grab active:cursor-grabbing' : ''}
        ${isBeingDragged ? 'opacity-30' : 'opacity-100'}`}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
            {pago.estudiante.nombres} {pago.estudiante.apellidos}
          </p>
          <p className="text-xs text-gray-400 truncate">{pago.estudiante.correo_institucional}</p>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 flex-shrink-0">
          {pago.tipo_periodo === 'SEMANAL' ? 'Sem' : 'Men'}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1 mb-3">
        {pago.dias_pagados.map((d: string) => (
          <span key={d} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md">
            {DIA_LABEL[d] ?? d}
          </span>
        ))}
        <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 ml-auto">
          {pago.cantidad_almuerzos} alm.
        </span>
      </div>

      {pago.observacion && (
        <p className="text-xs text-red-500 dark:text-red-400 mb-3 bg-red-50 dark:bg-red-900/20 px-2 py-1.5 rounded-lg leading-relaxed">
          {pago.observacion}
        </p>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-300 dark:text-gray-600">
          {new Date(pago.fecha_subida).toLocaleDateString('es-CO')}
        </span>
        <div className="flex items-center gap-1">
          <button
            onPointerDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); onPdf(pago.id_pago) }}
            disabled={pdfLoading === pago.id_pago}
            className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/30 rounded-lg transition"
          >
            {pdfLoading === pago.id_pago
              ? <Loader2 size={14} className="animate-spin" />
              : <FileText size={14} />}
          </button>
          {isPendiente && (
            <>
              <button
                onPointerDown={e => e.stopPropagation()}
                onClick={e => { e.stopPropagation(); onAprobar(pago.id_pago) }}
                className="p-1.5 text-green-500 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition"
                title="Aprobar"
              >
                <CheckCircle size={14} />
              </button>
              <button
                onPointerDown={e => e.stopPropagation()}
                onClick={e => { e.stopPropagation(); onRechazar(pago.id_pago) }}
                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                title="Rechazar"
              >
                <XCircle size={14} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function KanbanColumn({ estado, label, count, isDropTarget, activeId, children }: {
  estado: Estado
  label: string
  count: number
  isDropTarget: boolean
  activeId: number | null
  children: React.ReactNode
}) {
  const { setNodeRef, isOver } = useDroppable({ id: estado, disabled: !isDropTarget || !activeId })
  const cfg = COL_CONFIG[estado]

  return (
    <div className="flex flex-col flex-shrink-0 min-w-[260px] md:flex-1 md:min-w-0 overflow-hidden">
      <div className="flex items-center gap-2 px-1 py-2 mb-3">
        <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
        <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{label}</span>
        <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-lg border ${cfg.badge}`}>
          {count}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className={`flex-1 overflow-y-auto flex flex-col gap-3 p-3 rounded-2xl min-h-48 transition-all border ${
          isOver && isDropTarget
            ? `${cfg.dropBg} ring-2 ${cfg.ring} border-transparent`
            : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800'
        }`}
      >
        {children}
      </div>
    </div>
  )
}

function CarteraPage() {
  const [pagos, setPagos] = useState<PagoAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [activeId, setActiveId] = useState<number | null>(null)
  const [pdfLoading, setPdfLoading] = useState<number | null>(null)
  const [pendingRechazo, setPendingRechazo] = useState<number | null>(null)
  const [motivo, setMotivo] = useState('')
  const [procesando, setProcesando] = useState(false)

  const fetchPagos = useCallback(async () => {
    try {
      const data = await getPagos()
      setPagos(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchPagos() }, [fetchPagos])

  const handleAprobar = async (id: number) => {
    setProcesando(true)
    try {
      await actualizarEstadoPago(id, 'APROBADO')
      await fetchPagos()
    } finally {
      setProcesando(false)
    }
  }

  const handleRechazar = (id: number) => { setPendingRechazo(id); setMotivo('') }

  const confirmarRechazo = async () => {
    if (!pendingRechazo || !motivo.trim()) return
    setProcesando(true)
    try {
      await actualizarEstadoPago(pendingRechazo, 'RECHAZADO', motivo.trim())
      setPendingRechazo(null)
      setMotivo('')
      await fetchPagos()
    } finally {
      setProcesando(false)
    }
  }

  const handlePdf = async (id: number) => {
    setPdfLoading(id)
    try {
      const url = await getPdfUrlAdmin(id)
      window.open(url, '_blank')
    } finally {
      setPdfLoading(null)
    }
  }

  const handleDragStart = (e: DragStartEvent) => setActiveId(Number(e.active.id))
  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    setActiveId(null)
    if (!over) return
    const id = Number(active.id)
    if (over.id === 'APROBADO') handleAprobar(id)
    else if (over.id === 'RECHAZADO') handleRechazar(id)
  }

  const activePago = pagos.find(p => p.id_pago === activeId) ?? null

  const cols: { estado: Estado; label: string; isDropTarget: boolean }[] = [
    { estado: 'PENDIENTE', label: 'Pendiente', isDropTarget: false },
    { estado: 'APROBADO',  label: 'Aprobado',  isDropTarget: true  },
    { estado: 'RECHAZADO', label: 'Rechazado', isDropTarget: true  },
  ]

  if (loading) return (
    <div className="flex-1 flex items-center justify-center bg-slate-100 dark:bg-gray-950">
      <Loader2 size={24} className="animate-spin text-violet-400" />
    </div>
  )

  return (
    <div className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-hidden flex flex-col bg-slate-100 dark:bg-gray-950">

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-6">
        {STAT_CONFIG.map(({ estado, label, icon, iconBg, cardBg, border, count_text }) => {
          const count = pagos.filter(p => p.estado === estado).length
          return (
            <div key={estado} className={`${cardBg} rounded-2xl p-3 md:p-5 border ${border} flex flex-col md:flex-row md:items-center gap-2 md:gap-4`}>
              <div className={`w-9 h-9 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs md:text-sm font-semibold truncate ${count_text}`}>{label}</p>
                <p className={`text-xl md:text-2xl font-bold ${count_text}`}>{count}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Kanban */}
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 flex-1 overflow-x-auto pb-2">
          {cols.map(({ estado, label, isDropTarget }) => {
            const items = pagos.filter(p => p.estado === estado)
            return (
              <KanbanColumn
                key={estado}
                estado={estado}
                label={label}
                count={items.length}
                isDropTarget={isDropTarget}
                activeId={activeId}
              >
                {items.length === 0
                  ? <EmptyColumn />
                  : items.map(pago => (
                    <PagoCard
                      key={pago.id_pago}
                      pago={pago}
                      activeId={activeId}
                      onPdf={handlePdf}
                      pdfLoading={pdfLoading}
                      onAprobar={handleAprobar}
                      onRechazar={handleRechazar}
                    />
                  ))
                }
              </KanbanColumn>
            )
          })}
        </div>
        <DragOverlay>
          {activePago && <CardPreview pago={activePago} />}
        </DragOverlay>
      </DndContext>

      {/* Modal rechazo */}
      {pendingRechazo !== null && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl w-full max-w-sm p-6 border border-gray-100 dark:border-gray-800">
            <h3 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-1">Motivo del rechazo</h3>
            <p className="text-xs text-gray-400 mb-4">El estudiante verá este mensaje en su billetera</p>
            <textarea
              value={motivo}
              onChange={e => setMotivo(e.target.value)}
              placeholder="Ej: El comprobante no es legible..."
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 dark:placeholder-gray-500 resize-none h-24 outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 transition"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => { setPendingRechazo(null); setMotivo('') }}
                className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                Cancelar
              </button>
              <button
                onClick={confirmarRechazo}
                disabled={!motivo.trim() || procesando}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 disabled:opacity-40 flex items-center justify-center gap-2 transition">
                {procesando && <Loader2 size={14} className="animate-spin" />}
                Rechazar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CarteraPage
