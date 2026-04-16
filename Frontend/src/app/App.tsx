import axios from "axios"
import { useState, useEffect } from "react"

interface Estudiante {
  id_estudiante: number;
  numero_identificacion: string;
  tipo_identificacion: string;
  nombres: string;
  apellidos: string;
  correo_personal: string;
  correo_institucional: string;
  programa: string;
  estado: string;
  contador_inasistencias: number;
  limite_inasistencias: number;
  fecha_registro: string;
}

function App() {
    
    const [data, setData] = useState<Estudiante[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getEstudiantes = async () => {
            try {
                const resp = await axios.get<Estudiante[]>("http://localhost:3000/api/estudiantes");
                setData(resp.data);
            } catch (error) {
                console.error("Error al obtener datos:", error);
            } finally {
                setLoading(false);
            }
        };

        getEstudiantes();
    }, []);

    if (loading) {
        return <h2>Cargando datos...</h2>;
    }

    return (
       <div>
        <h1>Lista de Estudiantes</h1>

        <ul>
            {data.map((estudiante) => (
                <li key={estudiante.id_estudiante}>
                    {estudiante.nombres} {estudiante.apellidos} - {estudiante.programa}
                </li>
            ))}
        </ul>
       </div>
    );
}

export default App;