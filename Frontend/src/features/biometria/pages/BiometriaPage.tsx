import { useState, useEffect, useRef } from 'react'
import { Fingerprint, Search, CheckCircle2, XCircle, Loader2, UserCheck, RefreshCw, Trash2, AlertTriangle } from 'lucide-react'
import api from '../../../shared/api/axios'

interface Estudiante {
    id_estudiante: number
    nombres: string
    apellidos: string
    numero_identificacion: string
    programa: string
    finger_id: number | null
}

interface EventoWS {
    evento: string
    mensaje?: string
    finger_id?: number
}

type Operacion = 'REGISTRAR' | 'ACTUALIZAR' | 'ELIMINAR' | null

function BiometriaPage() {
    const [busqueda, setBusqueda] = useState('')
    const [estudiante, setEstudiante] = useState<Estudiante | null>(null)
    const [buscando, setBuscando] = useState(false)
    const [errorBusqueda, setErrorBusqueda] = useState<string | null>(null)
    const [operacion, setOperacion] = useState<Operacion>(null)
    const [logs, setLogs] = useState<{ texto: string; tipo: 'info' | 'ok' | 'error' | 'warn' }[]>([])
    const [confirmarEliminar, setConfirmarEliminar] = useState(false)
    const [esp32Conectado, setEsp32Conectado] = useState(false)

    const wsRef = useRef<WebSocket | null>(null)
    const logsEndRef = useRef<HTMLDivElement>(null)
    const estudianteRef = useRef<Estudiante | null>(null)

    const agregarLog = (texto: string, tipo: 'info' | 'ok' | 'error' | 'warn' = 'info') => {
        setLogs(prev => [...prev, { texto, tipo }])
    }

    useEffect(() => {
        estudianteRef.current = estudiante
    }, [estudiante])

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [logs])

    useEffect(() => {
        const backendUrl = import.meta.env.VITE_API_URL?.replace('/sicu', '') ?? 'http://localhost:3000'
        const wsUrl = backendUrl.replace('http', 'ws') + '/sicu/ws'
        const ws = new WebSocket(wsUrl)
        wsRef.current = ws

        ws.onopen = () => {
            ws.send(JSON.stringify({ tipo: 'DISPOSITIVO', id: 'FRONTEND' }))
        }

        ws.onclose = () => setEsp32Conectado(false)

        ws.onmessage = (msg) => {
            let data: EventoWS
            try { data = JSON.parse(msg.data) } catch { return }

            switch (data.evento) {
                case 'ESP32_CONECTADO':
                    setEsp32Conectado(true)
                    break
                case 'ESP32_DESCONECTADO':
                    setEsp32Conectado(false)
                    break
                case 'REGISTRO_LISTO':
                    agregarLog('Pon el dedo en el sensor...', 'warn')
                    break
                case 'REGISTRO_PASO':
                    agregarLog('Primera lectura OK — retira y pon el dedo de nuevo', 'ok')
                    break
                case 'REGISTRO_OK':
                case 'REGISTRO_BD_OK':
                    agregarLog('Huella registrada correctamente', 'ok')
                    setOperacion(null)
                    if (estudianteRef.current) buscarEstudiante(estudianteRef.current.numero_identificacion)
                    break
                case 'ACTUALIZACION_LISTA':
                    agregarLog('Pon el dedo en el sensor para la nueva huella...', 'warn')
                    break
                case 'ACTUALIZACION_BD_OK':
                    agregarLog('Huella actualizada correctamente', 'ok')
                    setOperacion(null)
                    if (estudianteRef.current) buscarEstudiante(estudianteRef.current.numero_identificacion)
                    break
                case 'ELIMINACION_OK':
                case 'ELIMINACION_BD_OK':
                    agregarLog('Huella eliminada correctamente', 'ok')
                    setOperacion(null)
                    setConfirmarEliminar(false)
                    if (estudianteRef.current) buscarEstudiante(estudianteRef.current.numero_identificacion)
                    break
                case 'ERROR_BD':
                case 'ERROR':
                    agregarLog(`${data.mensaje ?? 'Error desconocido'}`, 'error')
                    setOperacion(null)
                    break
                default:
                    if (data.mensaje) agregarLog(data.mensaje, 'info')
            }
        }

        return () => ws.close()
    }, [])

    const buscarEstudiante = async (cedula?: string) => {
        const valor = cedula ?? busqueda.trim()
        if (!valor) return
        setBuscando(true)
        setErrorBusqueda(null)
        setEstudiante(null)
        setLogs([])
        setOperacion(null)
        setConfirmarEliminar(false)
        try {
            const res = await api.get(`/biometria/estudiante/${valor}`)
            setEstudiante(res.data)
        } catch {
            setErrorBusqueda('Estudiante no encontrado')
        } finally {
            setBuscando(false)
        }
    }

    const handleRegistrar = async () => {
        if (!estudiante) return
        setOperacion('REGISTRAR')
        setLogs([])
        agregarLog('Preparando sensor...', 'info')
        const finger_id = (estudiante.finger_id ?? 0) === 0
            ? Math.floor(Math.random() * 100) + 1
            : estudiante.finger_id! + 1
        try {
            const res = await api.post('/biometria/iniciar-registro', {
                finger_id,
                id_estudiante: estudiante.id_estudiante
            })
            if (!res.data.success) {
                agregarLog(`${res.data.mensaje}`, 'error')
                setOperacion(null)
            }
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { mensaje?: string } } })?.response?.data?.mensaje
            agregarLog(`${msg ?? 'Error conectando con el sensor'}`, 'error')
            setOperacion(null)
        }
    }

    const handleActualizar = async () => {
        if (!estudiante?.finger_id) return
        setOperacion('ACTUALIZAR')
        setLogs([])
        agregarLog('Preparando sensor para actualizar...', 'info')
        try {
            const res = await api.put(`/biometria/actualizar/${estudiante.finger_id}`, {
                finger_id_nuevo: estudiante.finger_id,
                id_estudiante: estudiante.id_estudiante
            })
            if (!res.data.success) {
                agregarLog(`${res.data.mensaje}`, 'error')
                setOperacion(null)
            }
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { mensaje?: string } } })?.response?.data?.mensaje
            agregarLog(`${msg ?? 'Error conectando con el sensor'}`, 'error')
            setOperacion(null)
        }
    }

    const handleEliminar = async () => {
        if (!estudiante?.finger_id) return
        setOperacion('ELIMINAR')
        setLogs([])
        agregarLog('Enviando comando al sensor...', 'info')
        try {
            const res = await api.delete(`/biometria/eliminar/${estudiante.finger_id}`)
            if (!res.data.success) {
                agregarLog(`${res.data.mensaje}`, 'error')
                setOperacion(null)
            } else {
                agregarLog('Comando enviado, eliminando huella del sensor...', 'info')
            }
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { mensaje?: string } } })?.response?.data?.mensaje
            agregarLog(`${msg ?? 'Error conectando con el sensor'}`, 'error')
            setOperacion(null)
        }
    }

    const handleCancelar = async () => {
        await api.post('/biometria/cancelar-registro').catch(() => {})
        setOperacion(null)
        setConfirmarEliminar(false)
        agregarLog('Operación cancelada', 'warn')
    }

    const colorLog = (tipo: string) => {
        if (tipo === 'ok') return 'text-green-600 dark:text-green-400'
        if (tipo === 'error') return 'text-red-500 dark:text-red-400'
        if (tipo === 'warn') return 'text-amber-500 dark:text-amber-400'
        return 'text-gray-600 dark:text-gray-400'
    }

    return (
        <div className="flex-1 p-8 overflow-y-auto bg-gray-50 dark:bg-gray-950">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Biometría</h1>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                    esp32Conectado
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400'
                }`}>
                    <div className={`w-2 h-2 rounded-full ${esp32Conectado ? 'bg-green-500' : 'bg-red-400'}`} />
                    {esp32Conectado ? 'Sensor conectado' : 'Sensor desconectado'}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* Panel izquierdo */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col gap-5">
                    <div className="flex items-center gap-2">
                        <UserCheck size={18} className="text-violet-500" />
                        <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Gestión de Huellas</p>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Cédula del estudiante</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Ej: 1067121844"
                                value={busqueda}
                                onChange={e => setBusqueda(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && buscarEstudiante()}
                                className="flex-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 placeholder:text-gray-400"
                            />
                            <button
                                onClick={() => buscarEstudiante()}
                                disabled={buscando}
                                className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl transition disabled:opacity-60"
                            >
                                {buscando ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                            </button>
                        </div>
                        {errorBusqueda && <p className="text-xs text-red-500 mt-1.5">{errorBusqueda}</p>}
                    </div>

                    {estudiante && (
                        <div className="bg-violet-50 dark:bg-violet-900/20 rounded-xl p-4 flex flex-col gap-2">
                            <p className="text-sm font-black text-gray-800 dark:text-gray-200">{estudiante.nombres} {estudiante.apellidos}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">C.C. {estudiante.numero_identificacion}</p>
                            <p className="text-xs text-gray-400">{estudiante.programa}</p>
                            <div className="flex items-center gap-2 mt-1">
                                {estudiante.finger_id !== null ? (
                                    <>
                                        <CheckCircle2 size={14} className="text-green-500" />
                                        <span className="text-xs text-green-600 dark:text-green-400 font-semibold">Huella registrada — Slot {estudiante.finger_id}</span>
                                    </>
                                ) : (
                                    <>
                                        <XCircle size={14} className="text-red-400" />
                                        <span className="text-xs text-red-400 font-semibold">Sin huella registrada</span>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {estudiante && !operacion && (
                        <div className="flex flex-col gap-2">
                            {!estudiante.finger_id ? (
                                <button onClick={handleRegistrar} disabled={!esp32Conectado}
                                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-xl transition disabled:opacity-50">
                                    <Fingerprint size={16} /> Registrar Huella
                                </button>
                            ) : (
                                <>
                                    <button onClick={handleActualizar} disabled={!esp32Conectado}
                                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-xl transition disabled:opacity-50">
                                        <RefreshCw size={16} /> Actualizar Huella
                                    </button>
                                    {!confirmarEliminar ? (
                                        <button onClick={() => setConfirmarEliminar(true)}
                                            className="flex items-center justify-center gap-2 w-full py-2.5 border-2 border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-bold rounded-xl transition">
                                            <Trash2 size={16} /> Eliminar Huella
                                        </button>
                                    ) : (
                                        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3 flex flex-col gap-2">
                                            <div className="flex items-center gap-2 text-red-500">
                                                <AlertTriangle size={14} />
                                                <span className="text-xs font-semibold">¿Confirmas eliminar la huella de {estudiante.nombres}?</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => setConfirmarEliminar(false)}
                                                    className="flex-1 py-1.5 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                                                    Cancelar
                                                </button>
                                                <button onClick={handleEliminar} disabled={!esp32Conectado}
                                                    className="flex-1 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50">
                                                    Sí, eliminar
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {operacion && (
                        <button onClick={handleCancelar}
                            className="w-full py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                            Cancelar operación
                        </button>
                    )}
                </div>

                {/* Panel derecho - logs */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <Fingerprint size={18} className="text-violet-500" />
                        <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Estado en tiempo real</p>
                        {operacion && (
                            <span className="ml-auto flex items-center gap-1.5 text-xs text-violet-500 font-semibold">
                                <Loader2 size={12} className="animate-spin" />
                                {operacion === 'REGISTRAR' ? 'Registrando...' : operacion === 'ACTUALIZAR' ? 'Actualizando...' : 'Eliminando...'}
                            </span>
                        )}
                    </div>
                    <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl p-4 min-h-[300px] max-h-[400px] overflow-y-auto flex flex-col gap-2">
                        {logs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                                <div className="w-14 h-14 rounded-2xl bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center">
                                    <Fingerprint size={28} className="text-violet-300" strokeWidth={1.5} />
                                </div>
                                <p className="text-xs text-gray-400">Los eventos del sensor aparecerán aquí<br />en tiempo real</p>
                            </div>
                        ) : (
                            logs.map((log, i) => (
                                <p key={i} className={`text-xs font-medium ${colorLog(log.tipo)}`}>{log.texto}</p>
                            ))
                        )}
                        <div ref={logsEndRef} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BiometriaPage
