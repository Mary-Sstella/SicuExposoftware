interface Dias {
  lunes?: boolean
  martes?: boolean
  miercoles?: boolean
  jueves?: boolean
  viernes?: boolean
}

interface Props {
  nombre: string
  apellido: string
  dias: Dias | null
  onClose: () => void
}

const diasSemana = [
  { key: 'lunes', label: 'Lunes' },
  { key: 'martes', label: 'Martes' },
  { key: 'miercoles', label: 'Miércoles' },
  { key: 'jueves', label: 'Jueves' },
  { key: 'viernes', label: 'Viernes' },
]

function DiasModal({ nombre, apellido, dias, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 shadow-xl w-80" onClick={(e) => e.stopPropagation()}>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-800">{nombre} {apellido}</h3>
            <p className="text-xs text-gray-400">Días de almuerzo</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg font-bold">✕</button>
        </div>

        <div className="flex flex-col gap-2">
          {diasSemana.map(({ key, label }) => {
            const activo = dias?.[key as keyof Dias]
            return (
              <div key={key} className={`flex items-center justify-between px-4 py-2.5 rounded-xl ${activo ? 'bg-violet-50' : 'bg-gray-50'}`}>
                <span className={`text-sm font-medium ${activo ? 'text-violet-700' : 'text-gray-400'}`}>{label}</span>
                {activo
                  ? <span className="text-violet-500 font-bold">✓</span>
                  : <span className="text-gray-300">—</span>
                }
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}

export default DiasModal
