import axios from "axios"
import { useState, useEffect } from "react"

function App() {
    
    const [Data, setData] = useState<string[]>([]);

    useEffect(() => {
        const getUsers = async () => {
            const resp = await axios.get("http://localhost:3000/api/users");
            const data = resp.data;
            setData(data.data);
        }
        getUsers()
    }, [])

    if (Data.length === 0) {
        return (
            <> 
                Cargando datos...
            </>
        )
    }

    return (
       <>
        Hola mundo  
        {
            Data.map((name: string) => (
                <li key={name}>{name}</li>
            ))
        }
       </>
    )
}

export default App