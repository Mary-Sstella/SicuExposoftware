import { useState } from 'react'
import { X, MessageCircle, Upload, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react'
import api from '../../../shared/api/axios'

function SoporteModal() { 
    const [open, setOpen] = useState(false) //controla si el modal esta abierto o cerrado
    //campos del formulario
    const [nombre, setNombre] = useState('')
    const [correo, setCorreo] = useState('')
    const [asunto, setAsunto] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [archivo, setArchivo] = useState<File | null>(null)
    //Estados de UI
    const [arrastrado, setArrastrado] = useState(false)  // resalta la zona de drop mientras se arrastra
    const [enviando, setEnviando] = useState(false)// deshabilita el botón mientras se envía
    const [enviado, setEnviado] = useState(false) //muestra la pantalla de confirmacion al terminar
    const [error, setError] = useState<string | null>(null)

    //limpia todos los campos al cerrar
    const reset = () => {
        setNombre(''); setCorreo(''); setAsunto(''); setDescripcion('')
        setArchivo(null); setError(null); setEnviado(false)
    }

    const handleClose = () => { setOpen(false); reset() }

    // Solo acepta PDF o imágenes, ignora cualquier otro tipo
    const handleArchivo = (file: File) => {
        if (file.type === 'application/pdf' || file.type.startsWith('image/')) setArchivo(file)
    }

     // Envía el ticket como multipart/form-data (necesario para el archivo adjunto)
    const handleSubmit = async () => {
        if (!nombre.trim() || !correo.trim() || !asunto.trim() || !descripcion.trim() || enviando) return
        setEnviando(true)
        setError(null)
        try {
            const form = new FormData()
            form.append('nombre', nombre)
            form.append('correo', correo)
            form.append('asunto', asunto)
            form.append('descripcion', descripcion)
            if (archivo) form.append('archivo', archivo)
            await api.post('/soporte', form)
            setEnviado(true)
        } catch (e: any) {
            setError(e?.response?.data?.msg ?? 'Error al enviar el ticket')
        } finally {
            setEnviando(false)
        }
    }

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-purple-400 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center"
                title="Soporte"
            >
                <MessageCircle size={24} />
            </button>

            {open && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div>
                                <h2 className="text-base font-bold text-gray-800">Reportar un problema</h2>
                                <p className="text-xs text-gray-400 mt-0.5">El administrador te responderá por correo</p>
                            </div>
                            <button onClick={handleClose} className="text-gray-300 hover:text-gray-500 transition">
                                <X size={20} />
                            </button>
                        </div>

                        {enviado ? (
                            <div className="p-10 flex flex-col items-center gap-4">
                                <CheckCircle2 size={48} className="text-green-400" />
                                <p className="text-gray-700 font-semibold text-center">¡Ticket enviado!</p>
                                <p className="text-sm text-gray-400 text-center">
                                    El administrador recibirá tu mensaje y te responderá al correo que ingresaste.
                                </p>
                                <button onClick={handleClose}
                                    className="mt-2 px-6 py-2.5 bg-violet-500 text-white rounded-xl text-sm font-semibold hover:bg-violet-600 transition">
                                    Cerrar
                                </button>
                            </div>
                        ) : (
                            <div className="p-6 flex flex-col gap-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 block">Nombre</label>
                                        <input value={nombre} onChange={e => setNombre(e.target.value)}
                                            placeholder="Tu nombre completo"
                                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 block">Correo institucional</label>
                                        <input value={correo} onChange={e => setCorreo(e.target.value)}
                                            placeholder="usuario@unicesar.edu.co"
                                            type="email"
                                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent" />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 block">Asunto</label>
                                    <input value={asunto} onChange={e => setAsunto(e.target.value)}
                                        placeholder="Describe brevemente tu problema"
                                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent" />
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 block">Descripción</label>
                                    <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)}
                                        placeholder="Explica con detalle el inconveniente..."
                                        rows={4}
                                        className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent" />
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 block">Adjunto <span className="font-normal text-gray-300">(opcional)</span></label>
                                    <div
                                        onDragOver={e => { e.preventDefault(); setArrastrado(true) }}
                                        onDragLeave={() => setArrastrado(false)}
                                        onDrop={e => { e.preventDefault(); setArrastrado(false); const f = e.dataTransfer.files[0]; if (f) handleArchivo(f) }}
                                        onClick={() => document.getElementById('soporte-archivo')?.click()}
                                        className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                                            arrastrado ? 'border-violet-400 bg-violet-50' :
                                            archivo ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-violet-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        <Upload size={20} className={archivo ? 'text-green-500' : 'text-gray-300'} />
                                        {archivo ? (
                                            <p className="text-sm text-green-600 font-medium text-center">{archivo.name}</p>
                                        ) : (
                                            <>
                                                <p className="text-xs text-gray-400 text-center">Arrastra aquí o haz clic para subir</p>
                                                <p className="text-xs text-gray-300">PDF o imagen</p>
                                            </>
                                        )}
                                    </div>
                                    <input id="soporte-archivo" type="file" accept="application/pdf,image/*" className="hidden"
                                        onChange={e => { const f = e.target.files?.[0]; if (f) handleArchivo(f) }} />
                                </div>

                                {error && (
                                    <div className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-xl text-xs text-red-500">
                                        <AlertCircle size={13} /> {error}
                                    </div>
                                )}

                                <div className="flex gap-3 pt-1">
                                    <button onClick={handleClose} disabled={enviando}
                                        className="flex-1 py-2.5 border border-gray-200 text-gray-500 rounded-xl text-sm font-semibold hover:bg-gray-50 transition disabled:opacity-50">
                                        Cancelar
                                    </button>
                                    <button onClick={handleSubmit}
                                        disabled={!nombre.trim() || !correo.trim() || !asunto.trim() || !descripcion.trim() || enviando}
                                        className="flex-1 py-2.5 bg-gradient-to-br from-violet-500 to-purple-400 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                        {enviando ? <><Loader2 size={15} className="animate-spin" /> Enviando...</> : 'Enviar ticket'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

export default SoporteModal
