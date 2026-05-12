import { useState } from 'react'
import DiasModal from './DiasModal'
import { Pencil } from 'lucide-react'
import EditarEstModal from './EditarEstModal'


interface Estudiante {
  id_estudiante: number
  numero_identificacion: string
  nombres: string
  apellidos: string
  programa: string
  estado: 'ACTIVO' | 'INACTIVO'
  contador_inasistencias: number
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
  estudiantes: Estudiante[] //recibe la lista de estudiantes 
  onEdit: () => void 
}

function EstudiantesTable({ estudiantes, onEdit }: Props) {
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState<{ id: number, nombres: string, apellidos: string, dias: {lunes: boolean, martes: boolean, miercoles: boolean, jueves: boolean, viernes: boolean} | null } | null>(null)
  const [estudianteAEditar, setEstudianteAEditar] = useState<Estudiante | null>(null)
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-violet-400 text-white text-left">
            <th className="px-4 py-3 font-medium rounded-tl-xl">#</th>
            <th className="px-4 py-3 font-medium">Nombre y Apellido</th>
            <th className="px-4 py-3 font-medium">Cédula</th>
            <th className="px-4 py-3 font-medium">Carrera</th>
            <th className="px-4 py-3 font-medium">Correo</th>
            <th className="px-4 py-3 font-medium">Días</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3 font-medium rounded-tr-xl">Inasistencias</th>
          </tr>
        </thead>
        <tbody>
          {estudiantes.map((est, index) => (
            <tr
              key={est.id_estudiante}
              className={`border-t border-gray-100 hover:bg-purple-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
            >
              <td className="px-4 py-3 text-gray-400 font-medium">{String(index + 1).padStart(2, '0')}</td>
              <td className="px-4 py-3 text-gray-800 font-semibold">
                <div className="flex items-center gap-2">
                  {est.nombres} {est.apellidos}
                  <button className="text-gray-300 hover:text-pink-500 transition-colors">
                    <Pencil size={14} 
                    onClick={() => setEstudianteAEditar(est)}/>
                  </button>
                </div>
              </td>
              <td className="px-4 py-3 text-gray-500">{est.numero_identificacion}</td>
              <td className="px-4 py-3 text-gray-500">{est.programa}</td>
              <td className="px-4 py-3 text-gray-500">{est.correo_institucional}</td>
              <td className="px-4 py-3">
                <button
                onClick={() => setEstudianteSeleccionado({ id: est.id_estudiante, nombres: est.nombres, apellidos: est.apellidos, dias: est.dias })}
                className="text-xs px-3 py-1 bg-pink-100 text-pink-600 font-semibold rounded-xl hover:bg-pink-200 transition-colors">Ver días
                </button>
              </td>
              <td className="px-4 py-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  est.estado === 'ACTIVO' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'
                }`}>
                  {est.estado}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-500">{est.contador_inasistencias}</td>
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
        />)}
    </div>
  )
}

export default EstudiantesTable

