import api from '../../../shared/api/axios'

export interface Menu {
    id_menu: number
    archivo_url: string
    archivo_firmada_url: string
    tipo_archivo: string
}

export const getMenu = (): Promise<Menu> =>
    api.get('/menu').then(r => r.data)

export const uploadMenu = (archivo: File): Promise<Menu> => {
    const form = new FormData()
    form.append('archivo', archivo)
    return api.post('/menu', form).then(r => r.data)
}

export const deleteMenu = (): Promise<void> =>
    api.delete('/menu').then(r => r.data)
