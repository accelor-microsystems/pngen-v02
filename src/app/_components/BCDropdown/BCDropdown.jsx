'use client'
import { Autocomplete, TextField } from "@mui/material";
import axios from "axios";
import { useScroll } from "framer-motion";
import { useEffect, useState } from "react";

export default function BCDropdown({ onChange }) {
    const [boadCategories, setBroadCategories] = useState([])
    const [broadCategorynames, setBroadCategorynames] = useState([])

    useEffect(() => {
        const fetchBroadCategories = async () => {
            const res = await axios.get('/api/fetchBroadCats')
            console.log(res.data)
            const names = res.data.map((item) => item.name)
            setBroadCategorynames(names)
        }
        fetchBroadCategories();
    }, [])


    return (
        <Autocomplete
            options={broadCategorynames}

            id="combo-box-demo"
            sx={{ width: 250, bgcolor: 'white' }}
            // value={broadCategory}
            onChange={onChange}
            renderInput={(params) => <TextField {...params} label='Choose broad category' />}
        />
    )
}