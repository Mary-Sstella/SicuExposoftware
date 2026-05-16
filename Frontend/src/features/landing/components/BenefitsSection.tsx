

function BenefitsSection() {
    const beneficios = [
        {
            titulo: 'Rerservas de turnos en linea',
            descripcion: 'Los estudiantes pueden reservar su turno sin necesidad de hacer largas filas evitando aglomeraciones',
            img: '/enlinea.png'
        },
        {
            titulo: 'Validacion de pagos',
            descripcion: 'Carga tu comprobante de pago y el sistema validara tu pago para que puedas acceder al comedor',
            img: '/comedor.png'
        },

        {
            titulo: 'Control de asistencia',
            descripcion: 'Registro de asistencia en tiempo real para garantizar un servicio eficiente y organizado',
            img: '/control.png'
        },
        {
            titulo: 'Historial de asistencias',
            descripcion: 'Consulta tu historial de asistencias en cualquier momento',
            img: '/asistencia.png'
        }
    ]

    return(
        <section className="bg-gradient-to-r from-purple-500 to-fuchsia-400 py-32 px-10">
            <h2 className="text-3xl font-bold text-white text-center mb-4">Beneficios del Sistema</h2>
            <p className="text-white/80 text-center mb-12 max-w-xl mx-auto">Todo lo que necesitas para gestionar el comedor y tu almuerzo 
            en un solo lugar</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {beneficios.map((b)=>(
                    <div key={b.titulo} className="bg-white rounded-2xl p-10 shadow-md flex flex-col items-center text-center gap-4">
                        <div className="w-50 h-40 rounded-xl overflow-hidden">
                            <img src={b.img} alt={b.titulo} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="font-bold text-gray-800 text-lg">{b.titulo}</h3>
                        <p className="text-gray-500 text-sm">{b.descripcion}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default BenefitsSection