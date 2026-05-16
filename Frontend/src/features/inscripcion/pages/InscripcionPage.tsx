import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../../shared/constants/routes'
import { FileCheck, UploadCloud } from 'lucide-react'
import { createInscripcion } from '../services/inscripcionesService'


const STEPS = [
  { number: 1, label: 'Datos Personales' },
  { number: 2, label: 'Contacto e Información' },
  { number: 3, label: 'Asistencia y Documentos' },
]

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']

type FormData = {
  nombre: string
  apellidos: string
  cedula: string
  genero: string
  carrera: string
  correo_institucional: string
  correo_personal: string
  lugar_origen: string
  lugar_residencia: string
  medio_transporte: string
  ocupacion_padres: string
  dias_semana: string[]
  sisben_pdf: File | null
  cedula_pdf: File | null
}

function InscripcionPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>({
    nombre: '',
    apellidos: '',
    cedula: '',
    genero: '',
    carrera: '',
    correo_institucional: '',
    correo_personal: '',
    lugar_origen: '',
    lugar_residencia: '',
    medio_transporte: '',
    ocupacion_padres: '',
    dias_semana: [],
    sisben_pdf: null,
    cedula_pdf: null,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => { //este método se encarga de actualizar el estado del formulario cada vez que el usuario cambia el valor de un campo de texto o selección
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleDia = (dia: string) => { //este metodo se encarga de agregar o quitar un día del arreglo dias_semana dependiendo de si ya está incluido o no
    setForm(prev => ({
      ...prev,
      dias_semana: prev.dias_semana.includes(dia)
        ? prev.dias_semana.filter(d => d !== dia)
        : [...prev.dias_semana, dia],
    }))
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, field: 'sisben_pdf' | 'cedula_pdf') => { //guarda el archivo en el estado del formulario
    const file = e.target.files?.[0] ?? null //obtenemos el primer archivo seleccionado o null si no hay ninguno
    setForm(prev => ({ ...prev, [field]: file })) //actualizamos el estado del formulario con el nuevo archivo
  }

  const handleSubmit = async () => { //este método se encarga de enviar los datos del formulario al backend
    const formData = new FormData() //empaca los datos que viajan al servidor en un formato multipart/form-data, que es adecuado para enviar archivos junto con otros datos
    Object.entries(form).forEach(([key, value]) => { 
      if (value instanceof File) formData.append(key, value)
      else if (Array.isArray(value)) formData.append(key, value.join(','))
      else if (value !== null) formData.append(key, value)
    })
    try {
    await createInscripcion(formData)
    alert('Solicitud enviada exitosamente')
    navigate(ROUTES.LOGIN)
  } catch (error) {
    alert('Error al enviar la solicitud. Intenta de nuevo.')
  }
}

  const inputClass = 'w-full bg-gray-50 rounded-xl px-4 py-2.5 text-sm border border-gray-200 focus:outline-none focus:border-violet-400 focus:bg-white transition'

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl p-10">

        {/* Link superior */}
        <div className="text-right text-sm mb-6">
          <span className="text-gray-400">¿Ya tienes cuenta? </span>
          <button onClick={() => navigate(ROUTES.LOGIN)} className="text-violet-600 font-semibold hover:underline">
            Iniciar Sesión
          </button>
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">Solicitud de Inscripción</h1>

        {/* Indicador de pasos */}
        <div className="flex items-center justify-center mb-10">
          {STEPS.map((s, i) => (
            <div key={s.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all
                  ${step >= s.number
                    ? 'bg-gradient-to-br from-purple-600 to-fuchsia-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-400'}`}>
                  {s.number}
                </div>
                <span className={`text-xs mt-1.5 font-medium ${step >= s.number ? 'text-violet-600' : 'text-gray-400'}`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-20 h-0.5 mb-5 mx-3 rounded transition-all ${step > s.number ? 'bg-violet-400' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Paso 1 */}
        {step === 1 && (
          <div>
            <h2 className="text-base font-semibold text-gray-700 mb-5">Datos Personales</h2>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Nombre</label>
                <input name="nombre" value={form.nombre} onChange={handleChange}
                  placeholder="Ingresa tu nombre" className={inputClass} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Apellidos</label>
                <input name="apellidos" value={form.apellidos} onChange={handleChange}
                  placeholder="Ingresa tus apellidos" className={inputClass} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Número de cédula</label>
                <input name="cedula" value={form.cedula} onChange={handleChange}
                  placeholder="Número de identificación" className={inputClass} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Género</label>
                <select name="genero" value={form.genero} onChange={handleChange} className={inputClass}>
                  <option value="">- Selecciona -</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-xs text-gray-500 mb-1.5 block">Carrera</label>
                <select name="carrera" value={form.carrera} onChange={handleChange} className={inputClass}>
                  <option value="">- Selecciona tu carrera -</option>
                  <option>Licenciatura en Educación Física, Recreación y Deportes</option>
                  <option>Licenciatura en Ciencias Naturales y Educación Ambiental</option>
                  <option>Licenciatura en Lengua Castellana e Inglés</option>
                  <option>Licenciatura en Arte y Folklore</option>
                  <option>Administración de Empresas</option>
                  <option>Administración de Empresas Turísticas y Hoteleras</option>
                  <option>Comercio Internacional</option>
                  <option>Contaduría Pública</option>
                  <option>Economía</option>
                  <option>Ingeniería de Sistemas</option>
                  <option>Ingeniería Agroindustrial</option>
                  <option>Ingeniería Ambiental y Sanitaria</option>
                  <option>Ingeniería Electrónica</option>
                  <option>Enfermería</option>
                  <option>Instrumentación Quirúrgica</option>
                  <option>Derecho</option>
                  <option>Psicología</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Paso 2 */}
        {step === 2 && (
          <div>
            <h2 className="text-base font-semibold text-gray-700 mb-5">Contacto e Información</h2>
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2">
                <label className="text-xs text-gray-500 mb-1.5 block">Correo institucional</label>
                <input name="correo_institucional" value={form.correo_institucional} onChange={handleChange}
                  placeholder="correo@unicesar.edu.co" className={inputClass} />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-gray-500 mb-1.5 block">
                  Correo personal <span className="text-gray-300">(opcional)</span>
                </label>
                <input name="correo_personal" value={form.correo_personal} onChange={handleChange}
                  placeholder="correo@gmail.com" className={inputClass} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">¿De dónde eres?</label>
                <input name="lugar_origen" value={form.lugar_origen} onChange={handleChange}
                  placeholder="Ciudad o municipio de origen" className={inputClass} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">¿Dónde vives actualmente?</label>
                <input name="lugar_residencia" value={form.lugar_residencia} onChange={handleChange}
                  placeholder="Ciudad o municipio de residencia" className={inputClass} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Medio de transporte</label>
                <select name="medio_transporte" value={form.medio_transporte} onChange={handleChange} className={inputClass}>
                  <option value="">- Selecciona -</option>
                  <option value="A pie">A pie</option>
                  <option value="Bicicleta">Bicicleta</option>
                  <option value="Moto">Moto</option>
                  <option value="Bus">Bus</option>
                  <option value="Carro">Carro</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">¿A qué se dedican tus padres?</label>
                <input name="ocupacion_padres" value={form.ocupacion_padres} onChange={handleChange}
                  placeholder="Ej: Abogado, Médico..." className={inputClass} />
              </div>
            </div>
          </div>
        )}

        {/* Paso 3 */}
        {step === 3 && (
          <div>
            <h2 className="text-base font-semibold text-gray-700 mb-5">Asistencia y Documentos</h2>

            {/* Días */}
            <div className="mb-7">
              <label className="text-xs text-gray-500 mb-3 block">Días que asistirás al comedor</label>
              <div className="flex gap-2">
                {DIAS.map(dia => (
                  <button key={dia} type="button" onClick={() => handleDia(dia)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
                      ${form.dias_semana.includes(dia)
                        ? 'bg-gradient-to-br from-purple-600 to-fuchsia-500 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                    {dia.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            {/* PDFs */}
            <div className="grid grid-cols-2 gap-5">
              {(['sisben_pdf', 'cedula_pdf'] as const).map(field => (
                <div key={field}>
                  <label className="text-xs text-gray-500 mb-2 block">
                    {field === 'sisben_pdf' ? 'PDF del SISBEN' : 'PDF de la cédula'}
                  </label>
                  <label className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-2xl cursor-pointer transition-all
                    ${form[field] ? 'border-violet-400 bg-violet-50' : 'border-gray-200 bg-gray-50 hover:border-violet-300 hover:bg-purple-50'}`}>
                    <input type="file" accept=".pdf,image/png" className="hidden"
                      onChange={e => handleFile(e, field)} />
                    {form[field] ? (
                        <div className="text-center px-3">
                            <FileCheck size={28} className="text-violet-500 mx-auto mb-1" />
                            <p className="text-xs text-violet-600 font-medium truncate max-w-[140px]">
                                {(form[field] as File).name}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">Haz clic para cambiar</p>
                        </div>
                        ) : (
                        <div className="text-center">
                            <UploadCloud size={32} className="text-gray-300 mx-auto mb-2" />
                            <p className="text-xs text-gray-500 font-medium">Haz clic para subir</p>
                            <p className="text-xs text-gray-400 mt-0.5">PDF o PNG · máx 5MB</p>
                            </div>)}
                            </label>
                        </div>
                ))}
            </div>
          </div>
        )}

        {/* Botones de navegación */}
        <div className="flex justify-between mt-10">
          {step > 1 ? (
            <button onClick={() => setStep(s => s - 1)}
              className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-500 text-sm font-medium hover:bg-gray-50 transition">
              Atrás
            </button>
          ) : <div />}

          {step < 3 ? (
            <button onClick={() => setStep(s => s + 1)}
              className="px-8 py-2.5 bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition shadow-sm">
              Siguiente
            </button>
          ) : (
            <button onClick={handleSubmit}
              className="px-8 py-2.5 bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition shadow-sm">
              Enviar solicitud
            </button>
          )}
        </div>

      </div>
    </div>
  )
}

export default InscripcionPage
