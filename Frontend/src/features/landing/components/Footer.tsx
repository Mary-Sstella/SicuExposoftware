


function Footer(){
    return(
        <footer className="bg-gray-900 text-white py-10 px-10">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <p className="text-xl font-bold text-white">SICU</p>
                    <p className="text-gray-400 text-sm mt-1">Sistema de Gestión del comedor Universitario</p>
                    <a 
                    href="https://www.unicesar.edu.co"
                    target="_blank"
                    rel= "noopener noreferrer"
                    className="text-violet-400 text-sm hover:text-purple-300 transition mt-1 inline-block">
                        Universidad del Cesar
                    </a>
                </div>

                <div className="flex flex-col items-center md:items-end gap-2">
                    <p className="text-gray-400 text-sm">Contactos</p>
                    <a href="https://www.instagram.com/unipopularcesar?igsh=aXQ0ODd1aDk3YXl1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 text-sm hover:text-violet-300 transition">
                        @unipopularcesar
                    </a>
                </div>
            </div>
            <p className="text-center text-gray-600 text-xs mt-8">© 2026 SICU. Universidad Popular del Cesar.</p>
        </footer>
    )
}

export default Footer