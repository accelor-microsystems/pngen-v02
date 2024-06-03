import { Autocomplete, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

export default function CategoryDropdown({ width, label, onValueChange, setCatWindowVisible, catWindowVisible }) {

    const [options, setOptions] = useState([]);
    const [value, setValue] = useState(null);

    useEffect(() => {

        const fetchData = async () => {
            try {
                const res = await axios.get('/api/category/');

                const allData = res.data;
                const uniqueCategories = [...new Set(allData.map(item => item.category))];
                console.log(uniqueCategories)
                setOptions([...uniqueCategories, "Other"]);

            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        fetchData();
    }, [catWindowVisible]);

    const handleChange = (event, newValue) => {
        if (newValue === "Other") {
            // console.log("other")
            setCatWindowVisible(true)
        }
        setValue(newValue);
        onValueChange(newValue); // Call the parent component's function
    };



    return (
        <Autocomplete
            options={options}
            disablePortal
            id="combo-box-demo"
            sx={{ width: 250, bgcolor: 'white' }}
            value={value}
            onChange={handleChange}
            renderInput={(params) => <TextField {...params} label={label} />}
        />
    )
}

//Name:-
// PNGEN- V.01
