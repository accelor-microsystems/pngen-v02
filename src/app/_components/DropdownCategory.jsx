import { Autocomplete, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

const DropdownCategory = ({ label, onChange, value, renderInputProps, defaultValue }) => {
    const [options, setOptions] = useState([]);

    useEffect(() => {

        const fetchData = async () => {
            try {
                const res = await axios.get('/api/category/');

                const allData = res.data;
                const uniqueCategories = [...new Set(allData.map(item => item.category))];
                console.log(uniqueCategories)
                setOptions([...uniqueCategories]);

            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        fetchData();
    }, []);

    return (
        <Autocomplete
            options={options}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    variant="outlined"
                    {...renderInputProps}
                />
            )}
        />
    );
};

export default DropdownCategory;