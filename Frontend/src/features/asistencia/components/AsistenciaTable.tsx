interface Asistencia{
    hora_reserva: string
    nombres: string
    apellidos: string
    numero_identificacion: string
    carrera: string
    turno: number | null
    metodo: 'HUELLA' | 'MANUAL' | null
    estado: 'PENDIENTE' | 'CONFIRMADO' | 'ENTREGADA'
}

interface Props{
    asistencias: Asistencia[]
}

function AsistenciaTable ({asistencias}: Props){
    return(
        <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-violet-600 text-white text-left">
                    <th className="px-4 py-3 font-medium rounded-tl-xl">Hora</th>
                    <th className="px-4 py-3 font-medium">Estudiante</th>
                    <th className="px-4 py-3 font-medium">Cédula</th>
                    <th className="px-4 py-3 font-medium">Carrera</th>
                    <th className="px-4 py-3 font-medium">Turno</th>
                    <th className="px-4 py-3 font-medium">Método</th>
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
        className={`border-t border-gray-100 hover:bg-purple-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
      >
        <td className="px-4 py-3 text-gray-500">{item.hora_reserva ?? '--'}</td>
        <td className="px-4 py-3 text-gray-800 font-semibold">{item.nombres} {item.apellidos}</td>
        <td className="px-4 py-3 text-gray-500">{item.numero_identificacion}</td>
        <td className="px-4 py-3 text-gray-500">{item.carrera}</td>
        <td className="px-4 py-3 text-gray-500">{item.turno ?? '--'}</td>
        {/*<td className="px-4 py-3 text-gray-500">{item.metodo ?? '--'}</td>*/}
        <td className="px-4 py-3 text-gray-500">
          {item.estado === 'ENTREGADA' ? (item.metodo ?? '--') : '—'}
        </td>
        <td className="px-4 py-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            item.estado === 'CONFIRMADO' || item.estado === 'ENTREGADA'
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
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
