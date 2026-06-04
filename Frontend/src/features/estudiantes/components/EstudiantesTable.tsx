import { useState } from 'react'
import DiasModal from './DiasModal'
import { Pencil, Trash2 } from 'lucide-react'
import EditarEstModal from './EditarEstModal'
import { deleteEstudiante } from '../services/estudiantesService'

interface Estudiante {
  id_estudiante: number
  numero_identificacion: string
  nombres: string
  apellidos: string
  programa: string
  estado: 'ACTIVO' | 'INACTIVO'
  contador_inasistencias: number
  limite_inasistencias: number
  correo_institucional: string
  correo_personal: string
  dias: {
    lunes: boolean
    martes: boolean
    miercoles: boolean
    jueves: boolean
    viernes: boolean
  } | null
}

interface Props {
  estudiantes: Estudiante[]
  onEdit: () => void
  onDelete: () => void
  offset?: number
}

function EstudiantesTable({ estudiantes, onEdit, onDelete, offset = 0 }: Props) {
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState<{ id: number, nombres: string, apellidos: string, dias: {lunes: boolean, martes: boolean, miercoles: boolean, jueves: boolean, viernes: boolean} | null } | null>(null)
  const [estudianteAEditar, setEstudianteAEditar] = useState<Estudiante | null>(null)

  const handleEliminar = async (id: number, nombre: string) => {
    if (!confirm(`¿Eliminar a ${nombre} del sistema? Esta acción no se puede deshacer.`)) return
    await deleteEstudiante(id)
    onDelete()
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700 text-left bg-gray-50 dark:bg-gray-800/50">
            <th className="px-4 py-3 text-xs font-semibold text-violet-500 uppercase tracking-wide">#</th>
            <th className="px-4 py-3 text-xs font-semibold text-violet-500 uppercase tracking-wide">Nombre y Apellido</th>
            <th className="px-4 py-3 text-xs font-semibold text-violet-500 uppercase tracking-wide hidden md:table-cell">Cédula</th>
            <th className="px-4 py-3 text-xs font-semibold text-violet-500 uppercase tracking-wide hidden md:table-cell">Carrera</th>
            <th className="px-4 py-3 text-xs font-semibold text-violet-500 uppercase tracking-wide hidden md:table-cell">Correo</th>
            <th className="px-4 py-3 text-xs font-semibold text-violet-500 uppercase tracking-wide hidden md:table-cell">Días</th>
            <th className="px-4 py-3 text-xs font-semibold text-violet-500 uppercase tracking-wide">Estado</th>
            <th className="px-4 py-3 text-xs font-semibold text-violet-500 uppercase tracking-wide hidden md:table-cell">Inasistencias</th>
          </tr>
        </thead>
        <tbody>
          {estudiantes.map((est, index) => (
            <tr
              key={est.id_estudiante}
              className={`border-t border-gray-100 dark:border-gray-800 hover:bg-purple-50 dark:hover:bg-gray-800 transition-colors ${
                index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-900/60'
              }`}
            >
              <td className="px-4 py-3 text-gray-400 dark:text-gray-500 font-medium">{String(offset + index + 1).padStart(2, '0')}</td>
              <td className="px-4 py-3 text-gray-800 dark:text-gray-200 font-semibold">
                <div className="flex items-center gap-2">
                  {est.nombres} {est.apellidos}
                  <button className="text-gray-300 hover:text-pink-500 transition-colors">
                    <Pencil size={14} onClick={() => setEstudianteAEditar(est)} />
                  </button>
                  <button
                    className="text-gray-300 hover:text-red-500 transition-colors"
                    onClick={() => handleEliminar(est.id_estudiante, `${est.nombres} ${est.apellidos}`)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
              <td className="px-4 py-3 text-gray-500 dark:text-gray-400 hidden md:table-cell">{est.numero_identificacion}</td>
              <td className="px-4 py-3 text-gray-500 dark:text-gray-400 hidden md:table-cell">{est.programa}</td>
              <td className="px-4 py-3 text-gray-500 dark:text-gray-400 hidden md:table-cell">{est.correo_institucional}</td>
              <td className="px-4 py-3 hidden md:table-cell">
                <button
                  onClick={() => setEstudianteSeleccionado({ id: est.id_estudiante, nombres: est.nombres, apellidos: est.apellidos, dias: est.dias })}
                  className="text-xs px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 font-semibold rounded-xl hover:bg-pink-200 dark:hover:bg-pink-900/50 transition-colors">
                  Ver días
                </button>
              </td>
              <td className="px-4 py-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  est.estado === 'ACTIVO'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400'
                }`}>
                  {est.estado}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-500 dark:text-gray-400 hidden md:table-cell">{est.contador_inasistencias}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {estudianteSeleccionado && (
        <DiasModal
          nombre={estudianteSeleccionado.nombres}
          apellido={estudianteSeleccionado.apellidos}
          dias={estudianteSeleccionado.dias}
          onClose={() => setEstudianteSeleccionado(null)}
        />
      )}
      {estudianteAEditar && (
        <EditarEstModal
          estudiante={estudianteAEditar}
          onClose={() => setEstudianteAEditar(null)}
          onSuccess={() => { setEstudianteAEditar(null); onEdit() }}
        />
      )}
    </div>
  )
}

export default EstudiantesTable
