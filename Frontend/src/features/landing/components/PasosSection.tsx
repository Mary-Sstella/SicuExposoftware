

function PasosSection() {
    const pasos = [
        {
            numero: 1,
            titulo: 'Sube tu comprobante de pago',
            descripcion: 'Carga el PDF de tu comprobante de pago para que el administrador valide tu acceso'
        },
        {
            numero: 2,
            titulo: 'Reserva tu turno',
            descripcion: 'Selecciona el horario que deseas para almorzar y reserva tu turno automaticamente'

        },
        {
            numero: 3,
            titulo: 'Asiste al comedor',
            descripcion: 'Ya puedes asistir al comedor con tu horario reservado y disfrutar de tu almuerzo sin largas filas ni esperas'
        }
    ]

    return(
        <section className="bg-violet-50 py-24 px-10">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
                <div className="flex-1 flex justify-center">
                    <img src="/lista.png"
                    alt="Como funciona"
                    className="w-full max-w-sm object-contain drop-shadow-xl"/>
                </div>
                <div className="flex-1 flex flex-col gap-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">¿Como funciona?</h2>
                        <p className="text-gray-500 mt-2">Accede al beneficio del comedor universitario en tres simples pasos:</p>
                    </div>
                    {pasos.map((p)=>(
                        <div key={p.numero} className="flex items-start gap-5">
                            <span className="text-4xl font-black bg-gradient-to-b from-violet-600 to-violet-500 bg-clip-text text-transparent leading-none">
                                {p.numero}
                            </span>
                            <div>
                                <h3 className="font-bold text-gray-800 text-lg">{p.titulo}</h3>
                                <p className="text-gray-500 text-sm mt-1">{p.descripcion}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default PasosSection