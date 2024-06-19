import { Autocomplete, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

export default function ProjectDropdown({ onChange }) {
    const [projects, setProjects] = useState([])

    const fetchProductionProjects = async () => {
        try {
            const res = await axios.get('/api/production/fetchProjects')
            if (res.data) {
                console.log(res.data)
                const names = res.data.map(item => item.name)
                console.log(names)
                setProjects(names)
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchProductionProjects();
    }, [])

    return (
        <Autocomplete
            options={projects}
            disablePortal
            size="small"
            id="combo-box-demo"
            onChange={onChange}
            sx={{ width: 250, bgcolor: 'white' }}
            renderInput={(params) => <TextField {...params} label='Choose project' />}
        />
    )
}