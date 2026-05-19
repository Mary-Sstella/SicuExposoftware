import { useState, useEffect, useCallback } from 'react'
import {
  DndContext, DragOverlay,
  useDraggable, useDroppable,
  type DragEndEvent, type DragStartEvent,
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { FileText, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { getPagos, actualizarEstadoPago, getPdfUrlAdmin, type PagoAdmin } from '../service/carteraService'

type Estado = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO'

const DIA_LABEL: Record<string, string> = {
  lunes: 'Lun', martes: 'Mar', miercoles: 'Mié', jueves: 'Jue', viernes: 'Vie',
}

const COL_STYLE: Record<Estado, { header: string; dot: string; ring: string }> = {
  PENDIENTE: { header: 'bg-amber-100 text-amber-700', dot: 'bg-amber-400',  ring: '' },
  APROBADO:  { header: 'bg-green-100 text-green-700', dot: 'bg-green-400',  ring: 'ring-green-200' },
  RECHAZADO: { header: 'bg-red-100 text-red-600',     dot: 'bg-red-400',    ring: 'ring-red-200' },
}

function CardPreview({ pago }: { pago: PagoAdmin }) { 
  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 w-72 rotate-1 opacity-95">
      <p className="text-sm font-bold text-gray-800">
        {pago.estudiante.nombres} {pago.estudiante.apellidos}
      </p>
      <p className="text-xs text-gray-400 mt-0.5">
        {pago.tipo_periodo} · {pago.cantidad_almuerzos} almuerzos
      </p>
      <div className="flex gap-1 mt-2 flex-wrap">
        {pago.dias_pagados.map((d: string) => ( 
          <span key={d} className="text-xs px-2 py-0.5 bg-violet-100 text-violet-600 rounded-lg">
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
      className={`bg-white rounded-2xl shadow-sm p-4 select-none transition-opacity
        ${isPendiente ? 'cursor-grab active:cursor-grabbing' : ''}
        ${isBeingDragged ? 'opacity-30' : 'opacity-100'}`}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">
            {pago.estudiante.nombres} {pago.estudiante.apellidos}
          </p>
          <p className="text-xs text-gray-400 truncate">{pago.estudiante.correo_institucional}</p>
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-lg flex-shrink-0 ${
          pago.tipo_periodo === 'SEMANAL' ? 'bg-violet-100 text-violet-600' : 'bg-blue-100 text-blue-600'
        }`}>
          {pago.tipo_periodo === 'SEMANAL' ? 'Sem' : 'Men'}
        </span>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {pago.dias_pagados.map((d: string) => (
          <span key={d} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-lg">
            {DIA_LABEL[d] ?? d}
          </span>
        ))}
        <span className="text-xs px-2 py-0.5 bg-violet-50 text-violet-600 rounded-lg font-semibold ml-auto">
          {pago.cantidad_almuerzos} alm.
        </span>
      </div>

      {pago.observacion && (
        <p className="text-xs text-red-400 mb-2 bg-red-50 px-2 py-1.5 rounded-lg">
          {pago.observacion}
        </p>
      )}

      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-gray-300">
          {new Date(pago.fecha_subida).toLocaleDateString('es-CO')}
        </span>
        <div className="flex items-center gap-1">
          <button
            onPointerDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); onPdf(pago.id_pago) }}
            disabled={pdfLoading === pago.id_pago}
            className="p-1.5 text-violet-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition"
          >
            {pdfLoading === pago.id_pago
              ? <Loader2 size={13} className="animate-spin" />
              : <FileText size={13} />}
          </button>
          {isPendiente && (
            <>
              <button
                onPointerDown={e => e.stopPropagation()}
                onClick={e => { e.stopPropagation(); onAprobar(pago.id_pago) }}
                className="p-1.5 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-lg transition"
                title="Aprobar"
              >
                <CheckCircle size={13} />
              </button>
              <button
                onPointerDown={e => e.stopPropagation()}
                onClick={e => { e.stopPropagation(); onRechazar(pago.id_pago) }}
                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Rechazar"
              >
                <XCircle size={13} />
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
  const style = COL_STYLE[estado]

  return (
    <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
      <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl mb-3 ${style.header}`}>
        <span className={`w-2 h-2 rounded-full ${style.dot}`} />
        <span className="text-sm font-bold">{label}</span>
        <span className="ml-auto text-xs font-semibold opacity-60">{count}</span>
      </div>
      <div
        ref={setNodeRef}
        className={`flex-1 overflow-y-auto flex flex-col gap-3 p-2 rounded-2xl min-h-48 transition-all ${
          isOver && isDropTarget
            ? `bg-white ring-2 ${style.ring} shadow-inner`
            : 'bg-gray-100/60'
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

  const handleRechazar = (id: number) => {
    setPendingRechazo(id)
    setMotivo('')
  }

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
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <Loader2 size={24} className="animate-spin text-violet-400" />
    </div>
  )

  return (
    <div className="flex-1 p-8 overflow-hidden flex flex-col bg-gray-50">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">Cartera</h1>
        <p className="text-sm text-gray-400 mt-0.5">Gestión de comprobantes de pago</p>
      </div>

      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-5 flex-1 overflow-hidden">
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
                {items.length === 0 && (
                  <p className="text-xs text-gray-300 text-center mt-6">Sin comprobantes</p>
                )}
                {items.map(pago => (
                  <PagoCard
                    key={pago.id_pago}
                    pago={pago}
                    activeId={activeId}
                    onPdf={handlePdf}
                    pdfLoading={pdfLoading}
                    onAprobar={handleAprobar}
                    onRechazar={handleRechazar}
                  />
                ))}
              </KanbanColumn>
            )
          })}
        </div>

        <DragOverlay>
          {activePago && <CardPreview pago={activePago} />}
        </DragOverlay>
      </DndContext>

      {pendingRechazo !== null && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-base font-bold text-gray-800 mb-1">Motivo del rechazo</h3>
            <p className="text-xs text-gray-400 mb-4">El estudiante verá este mensaje en su billetera</p>
            <textarea
              value={motivo}
              onChange={e => setMotivo(e.target.value)}
              placeholder="Ej: El comprobante no es legible..."
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 resize-none h-24 outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 transition"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => { setPendingRechazo(null); setMotivo('') }}
                className="flex-1 py-2.5 border border-gray-200 text-gray-500 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">
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
