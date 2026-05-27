import { useEffect, useState } from 'react'
import { X, QrCode, Loader2, AlertCircle } from 'lucide-react'
import api from '../../../shared/api/axios'

interface Props {
    id_reserva: number
    onClose: () => void
}

function QRModal({ id_reserva, onClose }: Props) {
    const [codigo, setCodigo] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Llamada directa a la API en lugar de pasar por el servicio intermediario
        api.get(`/qr/${id_reserva}`)
            .then(res => {
                const code = res.data?.codigo_qr
                if (!code) throw new Error('El servidor no devolvió un código QR')
                setCodigo(code)
            })
            .catch(err => {
                const msg = err?.response?.data?.msg || err?.message || 'Error al generar el QR'
                setError(msg)
            })
            .finally(() => setLoading(false))
    }, [id_reserva])

    const qrUrl = codigo
        ? `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(codigo)}&ecc=H&margin=10`
        : null

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <QrCode size={20} className="text-violet-600" />
                        <h2 className="text-base font-bold text-gray-800">Tu QR de hoy</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-300 hover:text-gray-500 transition">
                        <X size={20} />
                    </button>
                </div>

                {loading && (
                    <div className="flex flex-col items-center gap-3 py-8">
                        <Loader2 size={32} className="text-violet-500 animate-spin" />
                        <p className="text-sm text-gray-400">Generando QR...</p>
                    </div>
                )}

                {error && (
                    <div className="flex flex-col items-center gap-3 py-4">
                        <AlertCircle size={32} className="text-red-400" />
                        <div className="bg-red-50 text-red-500 text-sm rounded-xl px-4 py-3 text-center w-full">
                            {error}
                        </div>
                        <button
                            onClick={onClose}
                            className="text-xs text-gray-400 hover:text-gray-600"
                        >
                            Cerrar
                        </button>
                    </div>
                )}

                {qrUrl && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="bg-white p-4 rounded-2xl border-2 border-violet-100">
                            <img
                                src={qrUrl}
                                alt="Código QR"
                                width={256}
                                height={256}
                                className="rounded-xl"
                                onError={() => setError('No se pudo cargar la imagen del QR. Verifica tu conexión.')}
                            />
                        </div>
                        <p className="text-xs text-gray-400 text-center">
                            Muéstrale este QR al administrador.<br />
                            <span className="font-semibold text-amber-500">Válido solo por hoy</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default QRModal