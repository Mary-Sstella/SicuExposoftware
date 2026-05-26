import { useEffect, useState } from 'react'
import { X, QrCode, Loader2 } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { generarQR } from '../services/estudianteService'


interface Props {
    id_reserva: number
    onClose: () => void
}

function QRModal({id_reserva, onClose}: Props) {
    const [codigo, setCodigo] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        generarQR(id_reserva)
        .then(res => setCodigo(res.codigo_qr))
        .catch(err => setError(err?.response?.data?.msg || 'Error al generar QR'))
        .finally(() => setLoading(false))
    }, [id_reserva])

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
                    <div className="bg-red-50 text-red-500 text-sm rounded-xl px-4 py-3 text-center">{error}</div>
                )}

                {codigo && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="bg-white p-4 rounded-2xl border-2 border-violet-100">
                           <QRCodeSVG value={codigo} size={200} />
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
