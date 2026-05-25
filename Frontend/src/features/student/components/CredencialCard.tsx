import { useEffect, useState } from 'react'
import { Ticket, Info, Download, RefreshCw, QrCode } from 'lucide-react'
import { useAuthStore } from '../../auth/store/authStore'
import { getPerfilEstudiante } from '../services/estudianteService'
import { useMisTurnos } from '../hooks/useMisTurnos'

interface Perfil {
    nombres: string
    apellidos: string
    numero_identificacion: string
    programa: string
    semestre: number
    estado: string
}

function CredencialCard() {
    const { id_estudiante } = useAuthStore()
    const [perfil, setPerfil] = useState<Perfil | null>(null)
    const { turno } = useMisTurnos()

    useEffect(() => {
        if (!id_estudiante) return
        getPerfilEstudiante(id_estudiante).then(setPerfil)
    }, [id_estudiante])

    const inicial = perfil ? `${perfil.nombres[0]}${perfil.apellidos[0]}` : '?'

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full">

            {/* Banner + Avatar en wrapper relativo para posicionamiento absoluto */}
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

                {/* Avatar absolutamente posicionado sobre el borde del banner */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center shadow-lg border-4 border-white">
                        <span className="text-xl font-black text-white">{inicial}</span>
                    </div>
                </div>
            </div>

            {/* Info debajo del avatar */}
            <div className="flex flex-col items-center pt-10 px-4 pb-2 text-center">
                <p className="text-base font-black text-gray-800">
                    {perfil ? `${perfil.nombres} ${perfil.apellidos}` : '—'}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                    {perfil?.programa ?? '—'}
                    {perfil?.semestre ? ` · Semestre ${perfil.semestre}` : ''}
                </p>
            </div>

            {/* QR */}
            <div className="mx-4 mt-3 flex-1 rounded-2xl border border-dashed border-gray-200 p-4 flex flex-col gap-3">
                <div className="flex items-center gap-1.5">
                    <Ticket size={12} className="text-violet-400" />
                    <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider">
                        Tu pase del día
                    </span>
                </div>

                <div className="flex flex-col items-center gap-2 flex-1 justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center">
                        <QrCode size={36} className="text-violet-500" strokeWidth={1.5} />
                    </div>
                    <p className="text-sm font-bold text-violet-600">Generar mi QR</p>
                    <p className="text-[10px] text-gray-400 text-center">
                        Disponible 15 min antes de tu turno
                    </p>
                </div>
            </div>

            {/* Info turno */}
            {turno?.hora_inicio && (
                <div className="mx-4 mt-3 flex items-start gap-2">
                    <Info size={12} className="text-violet-400 flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] text-gray-500 leading-relaxed">
                        Muestra este QR al ingresar al comedor entre{' '}
                        <span className="font-bold text-gray-700">{turno.hora_inicio} – {turno.hora_fin}</span>.
                    </p>
                </div>
            )}

            {/* Botones */}
            <div className="mx-4 mt-3 mb-4 flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-600 hover:bg-gray-50 transition">
                    <Download size={13} /> Descargar
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-600 hover:bg-gray-50 transition">
                    <RefreshCw size={13} /> Regenerar
                </button>
            </div>

        </div>
    )
}

export default CredencialCard
