import { Autocomplete, TextField } from "@mui/material";

export function Category({ data, setValue, onChange, label }) {
    return (
        <div>
            <Autocomplete
                options={data}
                disablePortal
                id="combo-box-demo"
                onChange={onChange}
                sx={{ width: 250, bgcolor: 'white' }}
                renderInput={(params) => <TextField {...params} label={label} />}
            />
        </div>
    )
}