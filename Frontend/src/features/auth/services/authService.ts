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

export const loginUsuario = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await api.post('/auth/login', payload)
  return response.data
}