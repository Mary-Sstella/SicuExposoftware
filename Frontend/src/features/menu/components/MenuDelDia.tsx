import { useEffect, useState } from 'react'
import { UtensilsCrossed, Loader2, ExternalLink } from 'lucide-react'
import { getMenu, type Menu } from '../../menu/services/menuService'

function MenuDelDia() {
    const [menu, setMenu] = useState<Menu | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getMenu()
            .then(setMenu)
            .catch(() => setMenu(null))
            .finally(() => setLoading(false))
    }, [])

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3 h-full">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <UtensilsCrossed size={16} className="text-violet-500" />
                    <p className="text-sm font-bold text-gray-700">Menú de la semana</p>
                </div>
                {menu && (
                    <a href={menu.archivo_firmada_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-violet-500 hover:text-violet-700">
                        <ExternalLink size={12} /> Ver completo
                    </a>
                )}
            </div>

            {loading && (
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 size={20} className="animate-spin text-violet-300" />
                </div>
            )}

            {!loading && !menu && (
                <div className="flex-1 flex flex-col items-center justify-center gap-2 py-4">
                    <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center">
                        <UtensilsCrossed size={26} className="text-violet-300" />
                    </div>
                    <p className="text-sm font-semibold text-gray-400">Sin menú disponible</p>
                    <p className="text-xs text-gray-300 text-center">El administrador aún no ha subido el menú</p>
                </div>
            )}

            {!loading && menu && (
                <div className="overflow-hidden rounded-xl max-h-52">
                    {menu.tipo_archivo.startsWith('image/') ? (
                        <img
                            src={menu.archivo_firmada_url}
                            alt="Menú del día"
                            className="w-full h-full object-contain rounded-xl"
                        />
                    ) : (
                        <iframe
                            src={menu.archivo_firmada_url}
                            className="w-full h-52 rounded-xl border-0"
                            title="Menú del día"
                        />
                    )}
                </div>
            )}
        </div>
    )
}

export default MenuDelDia
