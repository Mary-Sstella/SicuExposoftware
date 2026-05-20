import api from '../../../shared/api/axios'

export const getMisPagos = async () => {
    const res = await api.get('/pagos/mis-pagos');
    return res.data as{
        pagos: any[]
        saldo_disponible: number
        dias_registrados: string[]
    }
}

export const crearPago = async(params: {
    tipo_periodo: 'SEMANAL' | 'MENSUAL'
    dias_pagados: string[]
    archivo: File
})=> {
    const formData = new FormData() // Agregar los campos al FormData
    formData.append('tipo_periodo', params.tipo_periodo)
    formData.append('dias_pagados', JSON.stringify(params.dias_pagados))
    formData.append('comprobante_pdf', params.archivo)
    const res = await api.post('/pagos', formData, {
        headers: {'Content-Type': 'multipart/form-data'},
    })

    return res.data
}

export const getPdfUrl = async (id_pago: number): Promise<string> => {
    const res = await api.get(`/pagos/${id_pago}/pdf`);
    return res.data.url;
}