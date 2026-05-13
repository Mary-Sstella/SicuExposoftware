
//hook que maneja los estados del formulario
import { useState } from 'react'
import { loginUsuario } from '../services/authService'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../../shared/constants/routes'
import { useAuthStore } from '../store/authStore'

export function useAuth() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  const [adminUser, setAdminUser] = useState('') //se usa el estado para almacenar el valor del input en este caso el usuario del admin
  const [adminPassword, setAdminPassword] = useState('') //se usa el estado para almacenar el valor del input en este caso la contraseña del admin
  const [adminError, setAdminError] = useState('') //se usa el estado para almacenar el mensaje de error en caso de que el login falle
  const [adminLoading, setAdminLoading] = useState(false) //se usa el estado para almacenar el estado de carga del login, para deshabilitar el botón mientras se realiza la petición

  const [studentUser, setStudentUser] = useState('') 
  const [studentPassword, setStudentPassword] = useState('')
  const [studentError, setStudentError] = useState('')
  const [studentLoading, setStudentLoading] = useState(false)

  const handleAdminLogin = async () => { //esta funcion se ejecuta cuando el admin hace click en el botón de login, realiza la petición al backend y maneja la respuesta
    setAdminError('')
    setAdminLoading(true)
    try {
      const data = await loginUsuario({ credencial: adminUser, password: adminPassword }) //se llama a la función loginUsuario del auth, pasando el usuario y contraseña del admin, devuelve un objeto con el token, rol y username
      if (data.rol !== 'ADMIN') {
        setAdminError('Ingresa desde el portal estudiantil')
        return
      }
      setAuth(data.token, data.rol, data.username, null)
      navigate(ROUTES.DASHBOARD)
    } catch {
      setAdminError('Usuario o contraseña incorrectos')
    } finally {
      setAdminLoading(false)
    }
  }

  const handleStudentLogin = async () => {
    setStudentError('')
    setStudentLoading(true)
    try {
      const data = await loginUsuario({ credencial: studentUser, password: studentPassword })
      if (data.rol === 'ADMIN') {
        setStudentError('Ingresa desde el panel administrativo')
        return
      }
      setAuth(data.token, data.rol, data.username,data.id_estudiante)
      navigate(ROUTES.STUDENT)
    } catch {
      setStudentError('Usuario o contraseña incorrectos')
    } finally {
      setStudentLoading(false)
    }
  }

  return { //se retotna el estados y las funciones para ser usados en el componente LoginForm
    adminUser, setAdminUser,
    adminPassword, setAdminPassword,
    adminError, setAdminError, adminLoading, handleAdminLogin,
    studentUser, setStudentUser,
    studentPassword, setStudentPassword,
    studentError, setStudentError, studentLoading, handleStudentLogin,
  }
}
