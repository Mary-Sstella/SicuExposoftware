import { useEstudiantes } from '../hooks/useEstudiantes'
import EstudiantesTable from '../components/EstudiantesTable'
import { useState } from 'react'
import InscribirEstudianteModal from '../components/InscribirEstudianteModal'

function EstudiantesPage() {
  const { estudiantes, loading, refetch } = useEstudiantes()
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<'TODOS' | 'ACTIVO' | 'INACTIVO'>('TODOS')
  const [modalAbierto, setModalAbierto] = useState(false)
  const estudiantesFiltrados = estudiantes
  .filter((est) =>
    `${est.nombres} ${est.apellidos}`.toLowerCase().includes(busqueda.toLowerCase()) ||
    String(est.numero_identificacion).includes(busqueda)
  )
  .filter((est) => filtroEstado === 'TODOS' || est.estado === filtroEstado)
  //el tolowercase se usa para que no se pueda distinguir entre mayusculas y minusculas
  

  return (
    <>
    <div className="flex-1 p-8 overflow-y-auto bg-gray-50">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-base font-semibold text-gray-700">Listado de estudiantes inscritos en el sistema</h2>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <input
            type="text"
            placeholder="Buscar por nombre o cédula..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-96 px-4 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-300"
          />
            <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value as 'TODOS' | 'ACTIVO' | 'INACTIVO')}
            className="px-4 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-300 text-gray-500 bg-white">
                <option value="TODOS">Todos</option>
                <option value="ACTIVO">Activo</option>
                <option value="INACTIVO">Inactivo</option>
            </select>
            <button onClick={() => setModalAbierto(true)} className='ml-auto px-5 py-2 bg-gradient-to-br from-violet-500 via-violet-400 to-purple-300 hover:opacity-90 text-white text-sm font-semibold rounded-2xl transition-opacity shadow-md'>
              + Inscribir Estudiante
            </button>
        </div>
        {loading ? (
          <p className="text-sm text-gray-400">Cargando...</p>
        ) : (
          <EstudiantesTable estudiantes={estudiantesFiltrados} onEdit={refetch} />
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
