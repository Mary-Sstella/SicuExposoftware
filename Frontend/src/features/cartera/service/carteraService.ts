import api from '../../../shared/api/axios'

export type PagoAdmin = {
  id_pago: number
  tipo_periodo: 'SEMANAL' | 'MENSUAL'
  dias_pagados: string[]
  cantidad_almuerzos: number
  almuerzos_usados: number
  estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO'
  pdf_url: string
  observacion: string | null
  fecha_subida: string
  fecha_revision: string | null
  estudiante: {
    nombres: string
    apellidos: string
    correo_institucional: string
  }
}

export const getPagos = async (): Promise<PagoAdmin[]> => {
  const res = await api.get('/pagos')
  return res.data
}

export const actualizarEstadoPago = async (
  id: number,
  estado: 'APROBADO' | 'RECHAZADO',
  observacion?: string
) => {
  const res = await api.patch(`/pagos/${id}/estado`, { estado, observacion })
  return res.data
}

export const getPdfUrlAdmin = async (id: number): Promise<string> => {
  const res = await api.get(`/pagos/${id}/pdf`)
  return res.data.url
}
