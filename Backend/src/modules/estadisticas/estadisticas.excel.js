const ExcelJS = require('exceljs')
const prisma = require('../../config/prisma')

const aplicarBordes = (sheet) => {
    sheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return
        row.eachCell(cell => {
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            }
        })
    })
}

async function generarExcelEstadisticas() {
    const porCarrera = await prisma.estudiante.groupBy({
        by: ['programa'],
        _count: { id_estudiante: true },
        orderBy: { _count: { id_estudiante: 'desc' } }
    })

    const hoy = new Date()
    const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
    const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0, 23, 59, 59)
    const reservasMes = await prisma.reservas.findMany({
        where: { fecha: { gte: primerDiaMes, lte: ultimoDiaMes } }
    })
    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
    const campos = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes']
    const asistencia = dias.map((dia, i) => ({
        dia,
        presentes: reservasMes.filter(r => r[campos[i]] && r.estado === 'ENTREGADA').length,
        ausentes: reservasMes.filter(r => r[campos[i]] && r.estado !== 'ENTREGADA').length
    }))

    const rangos = await prisma.configuracion_turnos.findMany({
        where: { activo: true },
        orderBy: { hora_inicio: 'asc' }
    })
    const rangosConTotal = await Promise.all(rangos.map(async (rango) => {
        const total = await prisma.reservas.count({ where: { hora_inicio: rango.hora_inicio } })
        return { hora_inicio: rango.hora_inicio, hora_fin: rango.hora_fin, capacidad_maxima: rango.capacidad_maxima, total_reservas: total }
    }))
    rangosConTotal.sort((a, b) => b.total_reservas - a.total_reservas)

    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'Sistema SICU'
    workbook.created = new Date()

    const headerStyle = {
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'cff4a49a' } },
        font: { bold: true, color: { argb: 'ffffffff' } },
        alignment: { horizontal: 'center' }
    }

    // Hoja 1 — Estudiantes por Carrera
    const hojaCarrera = workbook.addWorksheet('Estudiantes por Carrera')
    hojaCarrera.columns = [
        { header: 'Carrera', key: 'carrera', width: 40 },
        { header: 'Total Estudiantes', key: 'total', width: 20 }
    ]
    hojaCarrera.getRow(1).eachCell(cell => {
        cell.fill = headerStyle.fill
        cell.font = headerStyle.font
        cell.alignment = headerStyle.alignment
    })
    hojaCarrera.addRows(porCarrera.map(r => ({ carrera: r.programa, total: r._count.id_estudiante })))
    aplicarBordes(hojaCarrera)

    // Hoja 2 — Asistencia Mensual
    const hojaAsistencia = workbook.addWorksheet('Asistencia Mensual')
    hojaAsistencia.columns = [
        { header: 'Día', key: 'dia', width: 15 },
        { header: 'Presentes', key: 'presentes', width: 15 },
        { header: 'Ausentes', key: 'ausentes', width: 15 },
        { header: 'Total', key: 'total', width: 15 }
    ]
    hojaAsistencia.getRow(1).eachCell(cell => {
        cell.fill = headerStyle.fill
        cell.font = headerStyle.font
        cell.alignment = headerStyle.alignment
    })
    hojaAsistencia.addRows(asistencia.map(r => ({ dia: r.dia, presentes: r.presentes, ausentes: r.ausentes, total: r.presentes + r.ausentes })))
    aplicarBordes(hojaAsistencia)

    // Hoja 3 — Rangos Horarios
    const hojaRangos = workbook.addWorksheet('Rangos Horarios')
    hojaRangos.columns = [
        { header: 'Rango Horario', key: 'rango', width: 20 },
        { header: 'Capacidad Máxima', key: 'capacidad', width: 20 },
        { header: 'Total Reservas', key: 'total', width: 20 }
    ]
    hojaRangos.getRow(1).eachCell(cell => {
        cell.fill = headerStyle.fill
        cell.font = headerStyle.font
        cell.alignment = headerStyle.alignment
    })
    hojaRangos.addRows(rangosConTotal.map(r => ({ rango: r.hora_inicio + ' - ' + r.hora_fin, capacidad: r.capacidad_maxima, total: r.total_reservas })))
    aplicarBordes(hojaRangos)

    return workbook
}

module.exports = { generarExcelEstadisticas }
