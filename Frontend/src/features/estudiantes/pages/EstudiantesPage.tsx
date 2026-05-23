import { useEstudiantes } from '../hooks/useEstudiantes'
import EstudiantesTable from '../components/EstudiantesTable'
import { useState } from 'react'
import InscribirEstudianteModal from '../components/InscribirEstudianteModal'
import { Search } from 'lucide-react'

const POR_PAGINA = 9

function EstudiantesPage() {
  const { estudiantes, loading, refetch } = useEstudiantes()
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<'TODOS' | 'ACTIVO' | 'INACTIVO'>('TODOS')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [pagina, setPagina] = useState(1)

  const estudiantesFiltrados = estudiantes
    .filter((est) =>
      `${est.nombres} ${est.apellidos}`.toLowerCase().includes(busqueda.toLowerCase()) ||
      String(est.numero_identificacion).includes(busqueda)
    )
    .filter((est) => filtroEstado === 'TODOS' || est.estado === filtroEstado)

  const totalPaginas = Math.ceil(estudiantesFiltrados.length / POR_PAGINA)
  const inicio = (pagina - 1) * POR_PAGINA
  const estudiantesPagina = estudiantesFiltrados.slice(inicio, inicio + POR_PAGINA)

  const handleBusqueda = (val: string) => { setBusqueda(val); setPagina(1) }
  const handleFiltro = (val: 'TODOS' | 'ACTIVO' | 'INACTIVO') => { setFiltroEstado(val); setPagina(1) }

  return (
    <>
      <div className="flex-1 p-8 overflow-y-auto bg-slate-100">
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-700">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-gray-700">Listado de estudiantes inscritos en el sistema</h2>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="relative w-96">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o cédula..."
                value={busqueda}
                onChange={(e) => handleBusqueda(e.target.value)}
               className="w-full pl-9 pr-4 py-2 text-sm border border-gray-500 rounded-xl outline-none focus:ring-2 focus:ring-violet-200"
              />
            </div>
            <select
              value={filtroEstado}
              onChange={(e) => handleFiltro(e.target.value as 'TODOS' | 'ACTIVO' | 'INACTIVO')}
              className="px-4 py-2 text-sm border border-gray-500 rounded-xl outline-none focus:ring-2 focus:ring-violet-200 text-gray-500 bg-white"
            >
              <option value="TODOS">Todos</option>
              <option value="ACTIVO">Activo</option>
              <option value="INACTIVO">Inactivo</option>
            </select>
            <button
              onClick={() => setModalAbierto(true)}
              className="ml-auto px-5 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-2xl transition-all shadow-lg border-2 border-violet-700"
            >
              + Inscribir Estudiante
            </button>
          </div>

          {loading ? (
            <p className="text-sm text-gray-400">Cargando...</p>
          ) : (
            <>
              <EstudiantesTable
                estudiantes={estudiantesPagina}
                onEdit={refetch}
                onDelete={refetch}
                offset={inicio}
              />
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-400">
                  Mostrando {estudiantesFiltrados.length === 0 ? 0 : inicio + 1} a {Math.min(inicio + POR_PAGINA, estudiantesFiltrados.length)} de {estudiantesFiltrados.length} estudiantes
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPagina(p => Math.max(1, p - 1))}
                    disabled={pagina === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-sm text-gray-400 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                  >‹</button>
                  {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setPagina(p)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                        p === pagina ? 'bg-violet-600 text-white' : 'text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
                    disabled={pagina === totalPaginas || totalPaginas === 0}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-sm text-gray-400 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                  >›</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {modalAbierto && (
        <InscribirEstudianteModal
          onClose={() => setModalAbierto(false)}
          onSuccess={refetch}
        />
      )}
    </>
  )
}

export default EstudiantesPage
