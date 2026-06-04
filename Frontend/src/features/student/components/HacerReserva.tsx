import { Clock, CalendarCheck, CheckCircle2, ChevronLeft, AlertCircle, X } from 'lucide-react'
import { useHacerReserva } from '../hooks/useHacerReserva'

const DIAS_ETIQUETAS = [
    { key: 'lunes', label: 'Lun' },
    { key: 'martes', label: 'Mar' },
    { key: 'miercoles', label: 'Mié' },
    { key: 'jueves', label: 'Jue' },
    { key: 'viernes', label: 'Vie' },
]

const DIAS_SEMANA = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']

const formatFecha = (fecha: string) =>
    new Date(fecha.split('T')[0] + 'T12:00:00').toLocaleDateString('es-CO', {
        weekday: 'long', day: 'numeric', month: 'long'
    })

const manana = () => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}


function HacerReserva() {
    const {
        loading, dias, reservaActiva, paso, fechaSeleccionada,
        disponibilidad, reservaCreada, error, loadingConfirmar,
        seleccionarFecha, confirmar, volver,
        cancelar, cancelando, confirmandoCancelar, setConfirmandoCancelar
    } = useHacerReserva()


    if (loading) return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md rounded-2xl p-4 animate-pulse flex flex-col gap-3">
            <div className="h-4 bg-gray-100 rounded w-1/3" />
            <div className="h-10 bg-gray-100 rounded" />
            <div className="h-10 bg-gray-100 rounded w-2/3" />
        </div>
    )

    if (reservaActiva) return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md rounded-2xl p-3 flex flex-col gap-2">
        <div className="flex items-center gap-2">
            <CalendarCheck size={18} className="text-violet-500" />
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200">Tu próxima reserva</h3>
        </div>
        <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-black text-violet-600">#{reservaActiva.numero_turno}</span>
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 capitalize">
                    {formatFecha(reservaActiva.fecha)}
                </span>
                <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500 text-xs">
                    <Clock size={12} />
                    <span>{reservaActiva.hora_inicio} – {reservaActiva.hora_fin}</span>
                </div>
            </div>
        </div>
        <span className="text-xs bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 font-semibold px-3 py-2 rounded-xl">
            Estado: {reservaActiva.estado}
        </span>

        {!confirmandoCancelar ? (
            <button
                onClick={() => setConfirmandoCancelar(true)}
                className="text-xs text-red-400 hover:text-red-600 hover:bg-red-50 py-2 rounded-xl transition font-semibold"
            >
                Cancelar reserva
            </button>
        ) : (
            <div className="flex flex-col gap-2 bg-red-50 rounded-xl p-3">
                <div className="flex items-center justify-between">
                    <p className="text-xs text-red-600 font-semibold">¿Cancelar esta reserva?</p>
                    <button onClick={() => setConfirmandoCancelar(false)} className="text-gray-300 hover:text-gray-500">
                        <X size={14} />
                    </button>
                </div>
                <p className="text-xs text-red-400">El almuerzo no se reembolsa. Los demás estudiantes subirán de turno.</p>
                <div className="flex gap-2">
                    <button
                        onClick={() => setConfirmandoCancelar(false)}
                        disabled={cancelando}
                        className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-500 text-xs font-semibold hover:bg-white transition disabled:opacity-50"
                    >
                        Volver
                    </button>
                    <button
                        onClick={cancelar}
                        disabled={cancelando}
                        className="flex-1 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition disabled:opacity-50"
                    >
                        {cancelando ? 'Cancelando...' : 'Sí, cancelar'}
                    </button>
                </div>
            </div>
        )}
    </div>
)


    if (reservaCreada) return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md rounded-2xl p-4 flex flex-col items-center gap-4 text-center">
            <CheckCircle2 size={40} className="text-green-500" />
            <div>
                <p className="text-sm font-bold text-gray-800">¡Reserva confirmada!</p>
                <p className="text-xs text-gray-400 capitalize">{formatFecha(reservaCreada.fecha)}</p>
            </div>
            <div className="w-24 h-24 rounded-2xl bg-violet-100 flex items-center justify-center">
                <span className="text-4xl font-black text-violet-600">#{reservaCreada.numero_turno}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400 text-xs">
                <Clock size={12} />
                <span>{reservaCreada.hora_inicio} – {reservaCreada.hora_fin}</span>
            </div>
        </div>
    )

    if (paso === 1) {
        const handleFecha = (e: React.ChangeEvent<HTMLInputElement>) => {
            const fecha = e.target.value
            if (!fecha) return
            const diaSemana = DIAS_SEMANA[new Date(fecha + 'T12:00:00').getDay()]
            if (!dias?.[diaSemana as keyof typeof dias]) {
                e.target.value = ''
                return
            }
            seleccionarFecha(fecha)
        }

        return (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md rounded-2xl p-3 flex flex-col gap-2">
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200">Hacer reserva</h3>

                <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Tus días habilitados</p>
                    <div className="flex gap-2">
                        {DIAS_ETIQUETAS.map(({ key, label }) => (
                            <span
                                key={key}
                                className={`text-xs px-3 py-1 rounded-full font-semibold ${
                                    dias?.[key as keyof typeof dias]
                                        ? 'bg-violet-100 text-violet-600'
                                        : 'bg-gray-100 text-gray-300'
                                }`}
                            >
                                {label}
                            </span>
                        ))}
                    </div>
                </div>

                <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Selecciona una fecha (mínimo mañana, solo tus días)</p>
                    <input
                        type="date"
                        min={manana()}
                        onChange={handleFecha}
                        className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
                    />
                </div>

                {error && (
                    <div className="flex items-center gap-2 text-red-500 text-xs">
                        <AlertCircle size={14} />
                        <span>{error}</span>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md rounded-2xl p-3 flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <button onClick={volver} className="text-gray-400 hover:text-gray-600">
                    <ChevronLeft size={18} />
                </button>
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200 capitalize">{formatFecha(fechaSeleccionada)}</h3>
            </div>

            <p className="text-xs text-gray-400 dark:text-gray-500">Selecciona un horario disponible</p>

            <div className="flex flex-col gap-2">
                {disponibilidad.map((rango) => (
                    <div
                        key={rango.id_configuracion}
                        onClick={() => rango.disponible && !loadingConfirmar && confirmar(rango.id_configuracion)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                            rango.disponible
                                ? 'border-gray-200 dark:border-gray-600 hover:border-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/20 cursor-pointer'
                                : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 opacity-50 cursor-not-allowed'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <Clock size={14} className={rango.disponible ? 'text-violet-400' : 'text-gray-300'} />
                            <span className={`text-sm font-medium ${rango.disponible ? 'text-gray-700 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500'}`}>
                                {rango.hora_inicio} – {rango.hora_fin}
                            </span>
                        </div>
                        {rango.disponible
                            ? <span className="text-xs text-green-600 font-semibold">{rango.disponibles} cupos</span>
                            : <span className="text-xs text-red-400 font-semibold">Lleno</span>
                        }
                    </div>
                ))}
            </div>

            {loadingConfirmar && <p className="text-xs text-violet-500 text-center">Asignando turno...</p>}

            {error && (
                <div className="flex items-center gap-2 text-red-500 text-xs">
                    <AlertCircle size={14} />
                    <span>{error}</span>
                </div>
            )}
        </div>
    )
}

export default HacerReserva
