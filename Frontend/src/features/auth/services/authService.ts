import api from '../../../shared/api/axios'

export interface LoginPayload {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  rol: string
  username: string
}

interface Usuario {
  id_usuario: number
  username: string
  email: string
  password_hash: string
  rol: string
  activo: boolean
}

export const loginUsuario = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await api.get('/users')
  const usuarios: Usuario[] = response.data
  
  console.log('Usuarios:', usuarios)
  console.log('Buscando:', payload.username.trim(), payload.password.trim())
  
  const usuario = usuarios.find((u: Usuario) => 
    (u.username === payload.username.trim() || u.email === payload.username.trim())
  )

  console.log('Usuario encontrado:', usuario)

  if (!usuario || usuario.password_hash !== payload.password.trim()) {
    throw new Error('Credenciales incorrectas')
  }

  return {
    token: 'fake-token',
    rol: usuario.rol,
    username: usuario.username || usuario.email
  }
}