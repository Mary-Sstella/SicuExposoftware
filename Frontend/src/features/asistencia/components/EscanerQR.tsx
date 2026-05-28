import { useState } from 'react'
import { Scanner, useDevices } from '@yudiel/react-qr-scanner'
import { Camera, CheckCircle2, XCircle, RefreshCw } from 'lucide-react'
import api from '../../../shared/api/axios'

interface Resultado {
    nombres: string
    apellidos: string
    numero_identificacion: string
    programa: string
    numero_turno: number
    hora_inicio: string
    hora_fin: string
}

function EscanerQR() {
    const devices = useDevices()
    const [deviceId, setDeviceId] = useState<string | undefined>(undefined)
    const [activo, setActivo] = useState(false)
    const [procesando, setProcesando] = useState(false)
    const [resultado, setResultado] = useState<Resultado | null>(null)
    const [error, setError] = useState<string | null>(null)

    const iniciarScanner = () => {
        setResultado(null)
        setError(null)
        setProcesando(false)
        setActivo(true)
    }

    const handleScan = async (detected: { rawValue: string }[]) => {
        console.log('detectado:', detected)  
        if (procesando || !detected.length) return
        setProcesando(true)
        setActivo(false)
        try {
            const res = await api.post('/qr/escanear', { codigo_qr: detected[0].rawValue })
            setResultado(res.data)
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { msg?: string } } })?.response?.data?.msg
            setError(msg || 'QR inválido o ya utilizado')
        }

    }
    

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4 border border-gray-700">
            <div className="flex items-center gap-2">
                <Camera size={18} className="text-violet-500" />
                <p className="text-sm font-bold text-gray-700">Escáner QR</p>
                <p className="text-xs text-gray-400 ml-auto">Escanea el QR del estudiante</p>
            </div>

            {devices.length > 1 && (
                <select
                    value={deviceId ?? ''}
                    onChange={e => setDeviceId(e.target.value || undefined)}
                    className="text-xs border border-gray-200 rounded-xl px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-300"
                >
                    <option value="">Cámara por defecto</option>
                    {devices.map((d: MediaDeviceInfo) => (
                        <option key={d.deviceId} value={d.deviceId}>{d.label || d.deviceId}</option>
                    ))}
                </select>
            )}

            {!activo && !resultado && !error && (
                <div className="flex flex-col items-center gap-3 py-4">
                    <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center">
                        <Camera size={28} className="text-violet-500" />
                    </div>
                    <button
                        onClick={iniciarScanner}
                        className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl transition"
                    >
                        Activar cámara
                    </button>
                </div>
            )}

            {activo && (
                <div className="rounded-xl overflow-hidden">
                    <Scanner
                        onScan={handleScan}
                        onError={() => {}}
                        constraints={deviceId ? { deviceId } : { facingMode: 'user' }}
                        sound={true}
                        components={{ finder: true }}
                        scanDelay={300}
                    />
                </div>
            )}

            {resultado && (
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 size={18} />
                        <span className="text-sm font-bold">Asistencia registrada</span>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 flex flex-col gap-1.5">
                        <p className="text-base font-black text-gray-800">{resultado.nombres} {resultado.apellidos}</p>
                        <p className="text-xs text-gray-500">C.C. {resultado.numero_identificacion}</p>
                        <p className="text-xs text-gray-400">{resultado.programa}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="bg-violet-100 text-violet-700 text-xs font-black px-3 py-1 rounded-lg">
                                Turno #{resultado.numero_turno}
                            </span>
                            <span className="text-xs text-gray-500">{resultado.hora_inicio} – {resultado.hora_fin}</span>
                        </div>
                    </div>
                    <button onClick={iniciarScanner} className="flex items-center justify-center gap-1.5 text-xs text-violet-600 hover:underline">
                        <RefreshCw size={12} /> Escanear otro
                    </button>
                </div>
            )}

            {error && (
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-red-500">
                        <XCircle size={18} />
                        <span className="text-sm font-bold">{error}</span>
                    </div>
                    <button onClick={iniciarScanner} className="flex items-center justify-center gap-1.5 text-xs text-violet-600 hover:underline">
                        <RefreshCw size={12} /> Intentar de nuevo
                    </button>
                </div>
            )}
        </div>
    )
}

export default EscanerQR
