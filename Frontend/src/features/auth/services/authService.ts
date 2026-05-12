import api from '../../../shared/api/axios'

export interface LoginPayload {
  credencial: string
  password: string
}

export interface LoginResponse {
  token: string
  rol: string
  username: string
  id_estudiante: number | null
}

export const loginUsuario = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await api.post('/auth/login', payload)
  return response.data
}