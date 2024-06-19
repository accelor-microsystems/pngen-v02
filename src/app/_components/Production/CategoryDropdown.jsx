import { Autocomplete, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

export default function CategoryDropdownProduction({ onChange }) {
    const [options, setOptions] = useState([])

    const fetchProductionCategory = async () => {
        try {
            const res = await axios.get('/api/production/fetchCategory')
            if (res.data) {
                console.log(res.data)
                const names = res.data.map(item => item.category)
                console.log(names)
                setOptions(names)
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchProductionCategory();
    }, [])

    return (
        <Autocomplete
            options={options}
            disablePortal
            id="combo-box-demo"
            size="small"
            onChange={onChange}
            sx={{ width: 250, bgcolor: 'white' }}
            renderInput={(params) => <TextField {...params} label='Choose assembly category' />}
        />
    )
}