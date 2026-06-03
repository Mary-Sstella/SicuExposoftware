import { useState, useEffect, useRef } from 'react'
import { Fingerprint, X, CheckCircle2, XCircle } from 'lucide-react'

interface Props {
    onClose: () => void
    onAsistenciaRegistrada: () => void
}

interface Resultado {
    success: boolean
    mensaje: string
    estudiante?: { id: number; nombre: string }
}

function HuellaPanel({ onClose, onAsistenciaRegistrada }: Props) {
    const [estado, setEstado] = useState<'esperando' | 'procesando' | 'exito' | 'error'>('esperando')
    const [resultado, setResultado] = useState<Resultado | null>(null)
    const wsRef = useRef<WebSocket | null>(null)
    const montado = useRef(true)
    const onCloseRef = useRef(onClose)
    const onAsistenciaRef = useRef(onAsistenciaRegistrada)

    useEffect(() => { onCloseRef.current = onClose }, [onClose])
    useEffect(() => { onAsistenciaRef.current = onAsistenciaRegistrada }, [onAsistenciaRegistrada])

    useEffect(() => {
        montado.current = true

        const backendUrl = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000/sicu')
            .replace('/sicu', '')
        const wsUrl = backendUrl
            .replace('http://', 'ws://')
            .replace('https://', 'wss://')

        let ws: WebSocket | null = null

        const conectar = () => {
            ws = new WebSocket(wsUrl)
            wsRef.current = ws

            ws.onopen = () => {
                ws?.send(JSON.stringify({ tipo: 'DISPOSITIVO', id: 'FRONTEND' }))
            }

            ws.onmessage = (msg) => {
                if (!montado.current) return
                let data: {
                    evento: string
                    success?: boolean
                    mensaje?: string
                    estudiante?: { id: number; nombre: string }
                }
                try { data = JSON.parse(msg.data) } catch { return }

                if (data.evento === 'HUELLA_DETECTADA') {
                    setEstado('procesando')
                }

                if (data.evento === 'HUELLA_NO_ENCONTRADA') {
                    setResultado({ success: false, mensaje: data.mensaje ?? 'Huella no registrada' })
                    setEstado('error')
                }

                if (data.evento === 'ASISTENCIA_RESULTADO') {
                    setResultado({
                        success: data.success ?? false,
                        mensaje: data.mensaje ?? '',
                        estudiante: data.estudiante
                    })
                    setEstado(data.success ? 'exito' : 'error')
                    if (data.success) {
                        onAsistenciaRef.current()
                        setTimeout(() => {
                            if (montado.current) onCloseRef.current()
                        }, 2500)
                    }
                }
            }

            ws.onclose = () => {
                if (montado.current) {
                    setTimeout(conectar, 500)
                }
            }
        }

        const timer = setTimeout(conectar, 100)

        return () => {
            montado.current = false
            clearTimeout(timer)
            if (wsRef.current) {
                wsRef.current.onclose = null
                wsRef.current.close()
            }
        }
    }, [])

    const reiniciar = () => {
        setEstado('esperando')
        setResultado(null)
    }

    return (
        <>
            <style>{`
                @keyframes scan {
                    0%, 100% { transform: translateY(0px); opacity: 1; }
                    50% { transform: translateY(88px); opacity: 0.8; }
                }
                .scan-bar { animation: scan 2.2s ease-in-out infinite; }
                @keyframes glow-pulse {
                    0%, 100% { box-shadow: 0 0 20px 4px rgba(139,92,246,0.25); }
                    50% { box-shadow: 0 0 35px 10px rgba(139,92,246,0.45); }
                }
                .glow-icon { animation: glow-pulse 2.2s ease-in-out infinite; }
            `}</style>

            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xs p-8 flex flex-col items-center gap-6">

                    <div className="w-full flex items-center justify-between">
                        <h2 className="text-sm font-bold text-gray-700">Asistencia por Huella</h2>
                        <button onClick={onClose} className="text-gray-300 hover:text-gray-500 transition">
                            <X size={18} />
                        </button>
                    </div>

                    {estado === 'esperando' && (
                        <>
                            <div className="relative flex items-center justify-center">
                                <div className="absolute w-44 h-44 rounded-full border border-violet-200 animate-ping opacity-20" />
                                <div className="absolute w-36 h-36 rounded-full border border-violet-300 animate-ping opacity-25" style={{ animationDelay: '0.5s' }} />
                                <div className="glow-icon relative w-28 h-28 flex items-center justify-center overflow-hidden rounded-full">
                                    <Fingerprint size={96} className="text-violet-500" strokeWidth={1.2} />
                                    <div className="scan-bar absolute left-0 right-0 h-0.5 top-0 bg-gradient-to-r from-transparent via-violet-400 to-transparent" />
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-semibold text-gray-700">Esperando huella...</p>
                                <p className="text-xs text-gray-400 mt-1">Pide al estudiante que coloque<br />su dedo en el sensor</p>
                            </div>
                            <button onClick={onClose} className="text-xs text-gray-400 hover:text-gray-600 transition">
                                Cancelar
                            </button>
                        </>
                    )}

                    {estado === 'procesando' && (
                        <>
                            <div className="relative flex items-center justify-center">
                                <div className="absolute w-36 h-36 rounded-full border border-amber-300 animate-ping opacity-30" />
                                <Fingerprint size={96} className="text-amber-400 animate-pulse" strokeWidth={1.2} />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-semibold text-amber-600">Procesando huella...</p>
                                <p className="text-xs text-gray-400 mt-1">Verificando identidad</p>
                            </div>
                        </>
                    )}

                    {estado === 'exito' && resultado && (
                        <>
                            <CheckCircle2 size={56} className="text-green-500" />
                            <div className="text-center">
                                <p className="text-base font-black text-gray-800">{resultado.estudiante?.nombre}</p>
                                <p className="text-sm text-green-500 mt-1">Almuerzo entregado ✓</p>
                            </div>
                        </>
                    )}

                    {estado === 'error' && resultado && (
                        <>
                            <XCircle size={56} className="text-red-400" />
                            <div className="text-center">
                                {resultado.estudiante && (
                                    <p className="text-sm font-bold text-gray-700 mb-1">{resultado.estudiante.nombre}</p>
                                )}
                                <p className="text-xs text-red-400">{resultado.mensaje}</p>
                            </div>
                            <div className="flex gap-2 w-full">
                                <button onClick={reiniciar}
                                    className="flex-1 py-2 border border-gray-200 text-gray-600 text-xs font-semibold rounded-xl hover:bg-gray-50 transition">
                                    Intentar de nuevo
                                </button>
                                <button onClick={onClose}
                                    className="flex-1 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-xl transition">
                                    Cerrar
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

export default HuellaPanel
