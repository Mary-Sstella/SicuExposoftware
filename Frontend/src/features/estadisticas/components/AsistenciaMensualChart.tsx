import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Props {
    data: { dia: string; presentes: number; ausentes: number }[]
}

function AsistenciaMensualChart({ data }: Props) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-700 mb-4">Asistencia Mensual</h2>
            <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data} barGap={8} barSize={30} margin={{ left: -16 }}>
                    <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="dia" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: '12px' }} cursor={{ fill: '#f5f3ff' }} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="presentes" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="ausentes" fill="#EC489960" radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default AsistenciaMensualChart