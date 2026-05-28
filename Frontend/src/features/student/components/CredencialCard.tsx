import { useCallback, useEffect, useRef, useState } from 'react'
import { Ticket, Info, Download, RefreshCw, QrCode, AlertCircle } from 'lucide-react'
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react'
import { useAuthStore } from '../../auth/store/authStore'
import { getPerfilEstudiante, generarQR } from '../services/estudianteService'
import { useMisTurnos } from '../hooks/useMisTurnos'

interface Props {
    onQRGenerado?: (codigo: string) => void
}

interface Perfil {
    nombres: string
    apellidos: string
    numero_identificacion: string
    programa: string
    semestre: number
    estado: string
}

function CredencialCard({ onQRGenerado }: Props) {
    const { id_estudiante } = useAuthStore()
    const [perfil, setPerfil] = useState<Perfil | null>(null)
    const [codigoQR, setCodigoQR] = useState<string | null>(null)
    const [cargandoQR, setCargandoQR] = useState(false)
    const [errorQR, setErrorQR] = useState<string | null>(null)
    const qrRef = useRef<HTMLDivElement>(null)
    const { turno, loading: loadingTurno } = useMisTurnos()

    useEffect(() => {
        if (!id_estudiante) return
        getPerfilEstudiante(id_estudiante).then(setPerfil)
    }, [id_estudiante])

    const handleGenerarQR = useCallback(async () => {
        if (!turno?.id_reserva) return
        setCargandoQR(true)
        setErrorQR(null)
        try {
            const data = await generarQR(turno.id_reserva)
            setCodigoQR(data.codigo_qr)
            onQRGenerado?.(data.codigo_qr)
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { msg?: string } } })?.response?.data?.msg
            setErrorQR(msg || 'No se pudo generar el QR')
            setCodigoQR(null)
        } finally {
            setCargandoQR(false)
        }
    }, [turno?.id_reserva, onQRGenerado])

    useEffect(() => {
        if (loadingTurno) return
        if (turno?.id_reserva && turno.estado !== 'ENTREGADA' && turno.estado !== 'AUSENTE') {
            handleGenerarQR()
        }
    }, [loadingTurno, turno?.id_reserva, handleGenerarQR])

    const handleDescargar = () => {
        const canvas = document.getElementById('qr-canvas-descarga') as HTMLCanvasElement
        if (!canvas) return
        const a = document.createElement('a')
        a.download = `QR-turno-${turno?.numero_turno ?? 'hoy'}.png`
        a.href = canvas.toDataURL('image/png')
        a.click()
    }

    const inicial = perfil ? `${perfil.nombres[0]}${perfil.apellidos[0]}` : '?'
    const tieneTurnoPendiente = turno?.id_reserva && turno.estado !== 'ENTREGADA' && turno.estado !== 'AUSENTE'

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full">

            <div className="relative">
                <div className="bg-gradient-to-br from-violet-600 to-purple-500 px-4 pt-4 pb-10 rounded-t-3xl overflow-hidden">
                    <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
                    <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-white/10" />
                    <div className="flex items-center justify-between relative z-10">
                        <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">
                            Credencial Estudiante
                        </span>
                        {perfil?.numero_identificacion && (
                            <span className="text-[10px] text-white/70 font-mono">
                                #{perfil.numero_identificacion}
                            </span>
                        )}
                    </div>
                </div>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center shadow-lg border-4 border-white">
                        <span className="text-xl font-black text-white">{inicial}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center pt-10 px-4 pb-2 text-center">
                <p className="text-base font-black text-gray-800">
                    {perfil ? `${perfil.nombres} ${perfil.apellidos}` : '—'}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                    {perfil?.programa ?? '—'}
                    {perfil?.semestre ? ` · Semestre ${perfil.semestre}` : ''}
                </p>
            </div>

            <div className="mx-4 mt-3 flex-1 rounded-2xl border border-dashed border-gray-200 p-4 flex flex-col gap-3">
                <div className="flex items-center gap-1.5">
                    <Ticket size={12} className="text-violet-400" />
                    <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider">
                        Tu pase del día
                    </span>
                </div>

                <div className="flex flex-col items-center gap-2 flex-1 justify-center">
                    {codigoQR ? (
                        <div ref={qrRef} className="bg-white p-2 rounded-xl border border-violet-100">
                            {/* QR visible en pantalla */}
                            <QRCodeSVG value={codigoQR} size={130} />
                            {/* Canvas oculto solo para descarga a alta resolución */}
                            <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                                <QRCodeCanvas value={codigoQR} size={512} id="qr-canvas-descarga" includeMargin={true} />
                            </div>
                        </div>
                    ) : errorQR ? (
                        <div className="flex flex-col items-center gap-2 text-center">
                            <AlertCircle size={28} className="text-red-400" />
                            <p className="text-xs text-red-400 font-semibold">{errorQR}</p>
                            {tieneTurnoPendiente && (
                                <button
                                    onClick={handleGenerarQR}
                                    disabled={cargandoQR}
                                    className="text-xs text-violet-600 hover:underline mt-1"
                                >
                                    Reintentar
                                </button>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={handleGenerarQR}
                            disabled={!tieneTurnoPendiente || cargandoQR}
                            className={`flex flex-col items-center gap-2 w-full py-3 rounded-2xl transition
                                ${tieneTurnoPendiente
                                    ? 'hover:bg-violet-50 cursor-pointer'
                                    : 'cursor-default opacity-60'
                                }`}
                        >
                            <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center">
                                <QrCode size={36} className="text-violet-500" strokeWidth={1.5} />
                            </div>
                            <p className="text-sm font-bold text-violet-600">
                                {cargandoQR ? 'Generando...' : 'Generar mi QR'}
                            </p>
                            {!tieneTurnoPendiente && !loadingTurno && (
                                <p className="text-[10px] text-gray-400 text-center">
                                    Sin reserva para hoy
                                </p>
                            )}
                        </button>
                    )}
                </div>
            </div>

            {turno?.hora_inicio && (
                <div className="mx-4 mt-3 flex items-start gap-2">
                    <Info size={12} className="text-violet-400 flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] text-gray-500 leading-relaxed">
                        Muestra este QR al ingresar al comedor entre{' '}
                        <span className="font-bold text-gray-700">{turno.hora_inicio} – {turno.hora_fin}</span>.
                    </p>
                </div>
            )}

            <div className="mx-4 mt-3 mb-4 flex gap-2">
                <button
                    onClick={handleDescargar}
                    disabled={!codigoQR}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-600 hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <Download size={13} /> Descargar
                </button>
                <button
                    onClick={handleGenerarQR}
                    disabled={!tieneTurnoPendiente || cargandoQR}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-600 hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <RefreshCw size={13} /> Regenerar
                </button>
            </div>
        </div>
    )
}

export default CredencialCard