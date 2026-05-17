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
  const [errores, setErrores] = useState<Record<string, string>>({})
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

  const fieldClass = (campo: string) =>
    `w-full bg-gray-50 rounded-xl px-4 py-2.5 text-sm border ${
      errores[campo]
        ? 'border-red-400 bg-red-50'
        : 'border-gray-200 focus:border-violet-400 focus:bg-white'
    } focus:outline-none transition`

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errores[name]) setErrores(prev => ({ ...prev, [name]: '' }))
  }

  const handleDia = (dia: string) => {
    setForm(prev => ({
      ...prev,
      dias_semana: prev.dias_semana.includes(dia)
        ? prev.dias_semana.filter(d => d !== dia)
        : [...prev.dias_semana, dia],
    }))
    if (errores.dias_semana) setErrores(prev => ({ ...prev, dias_semana: '' }))
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, field: 'sisben_pdf' | 'cedula_pdf') => {
    const file = e.target.files?.[0] ?? null
    if (file && file.size > 5 * 1024 * 1024) {
      setErrores(prev => ({ ...prev, [field]: 'El archivo no puede superar los 5MB' }))
      e.target.value = ''
      return
    }
    setErrores(prev => ({ ...prev, [field]: '' }))
    setForm(prev => ({ ...prev, [field]: file }))
  }

  const validarPaso = () => {
    const e: Record<string, string> = {}

    if (step === 1) {
      if (!form.nombre.trim()) e.nombre = 'El nombre es obligatorio'
      if (!form.apellidos.trim()) e.apellidos = 'Los apellidos son obligatorios'
      if (!form.cedula.trim()) e.cedula = 'La cédula es obligatoria'
      else if (!/^\d+$/.test(form.cedula)) e.cedula = 'Solo debe contener números'
      if (!form.genero) e.genero = 'Selecciona un género'
      if (!form.carrera) e.carrera = 'Selecciona una carrera'
    }

    if (step === 2) {
      if (!form.correo_institucional.trim()) e.correo_institucional = 'El correo institucional es obligatorio'
      else if (!form.correo_institucional.endsWith('@unicesar.edu.co'))
        e.correo_institucional = 'Debe ser un correo @unicesar.edu.co'
      if (!form.lugar_origen.trim()) e.lugar_origen = 'Este campo es obligatorio'
      if (!form.lugar_residencia.trim()) e.lugar_residencia = 'Este campo es obligatorio'
      if (!form.medio_transporte) e.medio_transporte = 'Selecciona un medio de transporte'
      if (!form.ocupacion_padres.trim()) e.ocupacion_padres = 'Este campo es obligatorio'
    }

    if (step === 3) {
      if (form.dias_semana.length === 0) e.dias_semana = 'Selecciona al menos un día'
      if (!form.sisben_pdf) e.sisben_pdf = 'El PDF del SISBEN es obligatorio'
      if (!form.cedula_pdf) e.cedula_pdf = 'El PDF de la cédula es obligatorio'
    }

    setErrores(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validarPaso()) return
    const formData = new FormData()
    Object.entries(form).forEach(([key, value]) => {
      if (value instanceof File) formData.append(key, value)
      else if (Array.isArray(value)) formData.append(key, value.join(','))
      else if (value !== null) formData.append(key, value)
    })
    try {
      await createInscripcion(formData)
      alert('Solicitud enviada exitosamente')
      navigate(ROUTES.LOGIN)
    } catch {
      alert('Error al enviar la solicitud. Intenta de nuevo.')
    }
  }

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl p-10">

        <div className="text-right text-sm mb-6">
          <span className="text-gray-400">¿Ya tienes cuenta? </span>
          <button onClick={() => navigate(ROUTES.LOGIN)} className="text-violet-600 font-semibold hover:underline">
            Iniciar Sesión
          </button>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">Solicitud de Inscripción</h1>

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
                  placeholder="Ingresa tu nombre" className={fieldClass('nombre')} />
                {errores.nombre && <p className="text-xs text-red-500 mt-1">{errores.nombre}</p>}
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Apellidos</label>
                <input name="apellidos" value={form.apellidos} onChange={handleChange}
                  placeholder="Ingresa tus apellidos" className={fieldClass('apellidos')} />
                {errores.apellidos && <p className="text-xs text-red-500 mt-1">{errores.apellidos}</p>}
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Número de cédula</label>
                <input name="cedula" value={form.cedula} onChange={handleChange}
                  placeholder="Número de identificación" className={fieldClass('cedula')} />
                {errores.cedula && <p className="text-xs text-red-500 mt-1">{errores.cedula}</p>}
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Género</label>
                <select name="genero" value={form.genero} onChange={handleChange} className={fieldClass('genero')}>
                  <option value="">- Selecciona -</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                </select>
                {errores.genero && <p className="text-xs text-red-500 mt-1">{errores.genero}</p>}
              </div>
              <div className="col-span-2">
                <label className="text-xs text-gray-500 mb-1.5 block">Carrera</label>
                <select name="carrera" value={form.carrera} onChange={handleChange} className={fieldClass('carrera')}>
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
                {errores.carrera && <p className="text-xs text-red-500 mt-1">{errores.carrera}</p>}
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
                  placeholder="correo@unicesar.edu.co" className={fieldClass('correo_institucional')} />
                {errores.correo_institucional && <p className="text-xs text-red-500 mt-1">{errores.correo_institucional}</p>}
              </div>
              <div className="col-span-2">
                <label className="text-xs text-gray-500 mb-1.5 block">
                  Correo personal <span className="text-gray-300">(opcional)</span>
                </label>
                <input name="correo_personal" value={form.correo_personal} onChange={handleChange}
                  placeholder="correo@gmail.com" className={fieldClass('correo_personal')} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">¿De dónde eres?</label>
                <input name="lugar_origen" value={form.lugar_origen} onChange={handleChange}
                  placeholder="Ciudad o municipio de origen" className={fieldClass('lugar_origen')} />
                {errores.lugar_origen && <p className="text-xs text-red-500 mt-1">{errores.lugar_origen}</p>}
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">¿Dónde vives actualmente?</label>
                <input name="lugar_residencia" value={form.lugar_residencia} onChange={handleChange}
                  placeholder="Ciudad o municipio de residencia" className={fieldClass('lugar_residencia')} />
                {errores.lugar_residencia && <p className="text-xs text-red-500 mt-1">{errores.lugar_residencia}</p>}
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Medio de transporte</label>
                <select name="medio_transporte" value={form.medio_transporte} onChange={handleChange} className={fieldClass('medio_transporte')}>
                  <option value="">- Selecciona -</option>
                  <option value="A pie">A pie</option>
                  <option value="Bicicleta">Bicicleta</option>
                  <option value="Moto">Moto</option>
                  <option value="Bus">Bus</option>
                  <option value="Carro">Carro</option>
                </select>
                {errores.medio_transporte && <p className="text-xs text-red-500 mt-1">{errores.medio_transporte}</p>}
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">¿A qué se dedican tus padres?</label>
                <input name="ocupacion_padres" value={form.ocupacion_padres} onChange={handleChange}
                  placeholder="Ej: Abogado, Médico..." className={fieldClass('ocupacion_padres')} />
                {errores.ocupacion_padres && <p className="text-xs text-red-500 mt-1">{errores.ocupacion_padres}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Paso 3 */}
        {step === 3 && (
          <div>
            <h2 className="text-base font-semibold text-gray-700 mb-5">Asistencia y Documentos</h2>

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
              {errores.dias_semana && <p className="text-xs text-red-500 mt-2">{errores.dias_semana}</p>}
            </div>

            <div className="grid grid-cols-2 gap-5">
              {(['sisben_pdf', 'cedula_pdf'] as const).map(field => (
                <div key={field}>
                  <label className="text-xs text-gray-500 mb-2 block">
                    {field === 'sisben_pdf' ? 'PDF del SISBEN' : 'PDF de la cédula'}
                  </label>
                  <label className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-2xl cursor-pointer transition-all
                    ${errores[field] ? 'border-red-400 bg-red-50' :
                      form[field] ? 'border-violet-400 bg-violet-50' : 'border-gray-200 bg-gray-50 hover:border-violet-300 hover:bg-purple-50'}`}>
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
                        <UploadCloud size={32} className={`mx-auto mb-2 ${errores[field] ? 'text-red-400' : 'text-gray-300'}`} />
                        <p className="text-xs text-gray-500 font-medium">Haz clic para subir</p>
                        <p className="text-xs text-gray-400 mt-0.5">PDF o PNG · máx 5MB</p>
                      </div>
                    )}
                  </label>
                  {errores[field] && <p className="text-xs text-red-500 mt-1">{errores[field]}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-10">
          {step > 1 ? (
            <button onClick={() => setStep(s => s - 1)}
              className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-500 text-sm font-medium hover:bg-gray-50 transition">
              Atrás
            </button>
          ) : <div />}

          {step < 3 ? (
            <button onClick={() => { if (validarPaso()) setStep(s => s + 1) }}
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
