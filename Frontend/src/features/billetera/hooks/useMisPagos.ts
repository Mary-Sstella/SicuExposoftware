import { useCallback, useEffect, useState } from "react"
import { getMisPagos } from "../services/billeteraService"


export type Pago = {
    id_pago: number
    tipo_periodo: 'SEMANAL' | 'MENSUAL'
    dias_pagados: string[]
    cantidad_almuerzos: number
    almuerzos_usados: number
    estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO'
    pdf_url: string
    observacion?: string | null
    fecha_subida: string
}

export function useMisPagos(){
    const [pagos, setPagos] = useState<Pago[]>([])
    const [saldo, setSaldo] = useState<number>(0)
    const [diasRegistrados, setDiadosRegistrados] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const fetchPagos = useCallback(async()=>{
        try{
            setLoading(true)
            setError(null)
            const data = await getMisPagos()
            setPagos(data.pagos)
            setSaldo(data.saldo_disponible)
            setDiadosRegistrados(data.dias_registrados)
        }catch{
            setError('No se pudieron cargar los datos')
        }finally{
            setLoading(false)
        }
    }, []) // El array de dependencias está vacío porque no se necesita volver a crear la función a menos que cambien las dependencias, y en este caso no hay ninguna.

    useEffect(()=>{fetchPagos()}, [fetchPagos]) // El array de dependencias incluye fetchPagos para asegurarse de que se ejecute cuando la función cambie

    return {pagos, saldo, diasRegistrados, loading, error, refetch: fetchPagos}
}

