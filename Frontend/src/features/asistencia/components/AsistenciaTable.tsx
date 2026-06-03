interface Asistencia {
  hora_reserva: string
  nombres: string
  apellidos: string
  numero_identificacion: string
  carrera: string
  turno: number | null
  metodo: 'HUELLA' | 'MANUAL' | null
  estado: 'PENDIENTE' | 'CONFIRMADO' | 'ENTREGADA'
}

interface Props {
  asistencias: Asistencia[]
}

function AsistenciaTable({ asistencias }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-violet-600 text-white text-left">
            <th className="px-4 py-3 font-medium rounded-tl-xl">Hora</th>
            <th className="px-4 py-3 font-medium">Estudiante</th>
            <th className="px-4 py-3 font-medium hidden md:table-cell">Cédula</th>
            <th className="px-4 py-3 font-medium hidden md:table-cell">Carrera</th>
            <th className="px-4 py-3 font-medium hidden md:table-cell">Turno</th>
            <th className="px-4 py-3 font-medium hidden md:table-cell">Método</th>
            <th className="px-4 py-3 font-medium rounded-tr-xl">Estado</th>
          </tr>
        </thead>
        <tbody>
          {asistencias.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-gray-400 text-sm">
                No hay reservas para hoy
              </td>
            </tr>
          ) : (
            asistencias.map((item, index) => (
              <tr
                key={index}
                className={`border-t border-gray-100 dark:border-gray-800 hover:bg-purple-50 dark:hover:bg-gray-800 transition-colors ${
                  index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-900/60'
                }`}
              >
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{item.hora_reserva ?? '--'}</td>
                <td className="px-4 py-3 text-gray-800 dark:text-gray-200 font-semibold">{item.nombres} {item.apellidos}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400 hidden md:table-cell">{item.numero_identificacion}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400 hidden md:table-cell">{item.carrera}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400 hidden md:table-cell">{item.turno ?? '--'}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                  {item.estado === 'ENTREGADA' ? (item.metodo ?? '--') : '—'}
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.estado === 'CONFIRMADO' || item.estado === 'ENTREGADA'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                  }`}>
                    {item.estado}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default AsistenciaTable
