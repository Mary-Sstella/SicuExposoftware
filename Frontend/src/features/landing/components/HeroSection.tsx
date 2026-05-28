function HeroSection() {
    return (
        <section className="flex flex-col-reverse md:flex-row items-center justify-betwee px-16 py-24 max-w-6xl mx-auto gap-12">
            <div className="flex-1 space-y-6">
                <h1 className="text-5xl font-bold text-gray-800 leading-tight">Sistema de Gestion Universitario{' '}
                    <span className="bg-gradient-to-r from-violet-600 to-violet-500 bg-clip-text text-transparent">Para el comedor</span>
                </h1>
                <p className="text-gray-500 text-lg max-w-md">
                Plataforma que permite gestionar pagos, reservas de turnos y administración de usuarios para el comedor universitario, 
                facilitando la experiencia de estudiantes y personal administrativo.
            </p>
        </div>
        <div className="flex-1 flex justify-center">
            <img
            src="/panel.png"
            alt="Ilustracion principal"
            className="w-96 h-96 object-contain drop-shadow-xl"
            />
        </div>
    </section>
    )
}

export default HeroSection