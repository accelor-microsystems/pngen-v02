"use client"
import { InputText } from 'primereact/inputtext';
import axios from "axios"
import { use, useEffect, useState } from "react"
import Table from "../_components/Table";
import { AutoComplete } from 'primereact/autocomplete';
import { Autocomplete, TextField } from '@mui/material';
import CategoryDropdown from '../_components/CategoryDropdown';
import { fetchCategories } from '@/lib/actions';
import DropdownCategory from '../_components/DropdownCategory';

export default function View() {
    const [searchQuery, setSearchQuery] = useState('')
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState(null)
    const [subCategoryFilter, setSubCategoryFilter] = useState(null)
    const [categoryList, setCategoryList] = useState([])
    const [subcategoryList, setSubcategoryList] = useState([])
    const [makes, setMakes] = useState([])
    const [makeFilter, setMakeFilter] = useState(null)
    const [editWindow, setEditWindow] = useState(false)

    const [editData, setEditData] = useState([])

    const [category, setCategory] = useState("gfh")

    const handleCategoryChange = (e, val) => {
        setCategory(val)
    }


    const fetchData = async () => {
        const res = await axios.get('/api/table/')
        console.log(res.data)
        setData(res.data)
        setFilteredData(res.data)
    }

    const fetchMake = async () => {
        const res = await axios.get('/api/addMake')
        const allmakes = res.data
        const names = allmakes.map((item) => item.name).filter(name => name);
        setMakes(names)
    }

    useEffect(() => {
        fetchData();
        fetchMake();
    }, [])

    const handleSearch = (e) => {
        var val = e.target.value
        console.log(val)
        setSearchQuery(val)

        const filtered = data.filter((item) => item.mpn.trim().toLowerCase().includes(val.trim().toLowerCase()))
        setFilteredData(filtered)

    }

    const handleCategoryFilter = (e, val) => {

        if (val) {
            setCategoryFilter(val)
            const filtered = data.filter((item) => item.category.trim().toLowerCase() === val.trim().toLowerCase())
            setFilteredData(filtered)
        }
        else {
            setCategoryFilter(null)
            setFilteredData(data)
        }
    }

    const handleSubCategoryFilter = (e, val) => {
        setSubCategoryFilter(val)

        if (val) {
            const filtered = data.filter((item) => item.subcategory.trim().toLowerCase() === val.trim().toLowerCase())
            setFilteredData(filtered)
        }
        else {
            // setSubCategoryFilter(null)
            setFilteredData(data)
        }
    }

    const handleMakeFilter = (e, val) => {

        if (val) {
            setMakeFilter(val)
            if (filteredData) {

                const filtered = filteredData.filter((item) => item.make.trim().toLowerCase() === val.trim().toLowerCase())
                setFilteredData(filtered)
            }
            else {
                const filtered = data.filter((item) => item.make.trim().toLowerCase() === val.trim().toLowerCase())
                setFilteredData(filtered)
            }

        }
        else {
            setMakeFilter(null)
            setFilteredData(data)
        }
    }



    useEffect(() => {

        const fetchData = async () => {
            try {
                const res = await axios.get('/api/category/');

                const allData = res.data;
                const uniqueCategories = [...new Set(allData.map(item => item.category))];
                console.log(uniqueCategories)
                setCategoryList([...uniqueCategories]);

            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchSubcat = async () => {
            const res = await axios.get('/api/category/')
            const allData = res.data;
            const uniqueSubCategories = [...new Set(allData.map(item => item.subcategory))];
            const filteredSubCategories = Array.from(new Set(
                allData
                    .filter(item => item.category === categoryFilter)
                    .map(item => item.subcategory)
            ));
            console.log(filteredSubCategories)
            setSubcategoryList(filteredSubCategories);

        }
        fetchSubcat();
    }, [categoryFilter])







    return (

        <div className='px-[100px] min-h-[100vh] py-[20px] flex flex-col items-center justify-center'>

            <div className='flex w-full items-center justify-between my-4  bg-blue-50 p-4 rounded-full'>
                {/* <select onChange={handleCategoryFilter} value={categoryFilter} className=' justify-self-start border px-3 py-2 outline-none focus:border-blue-300'>
                    <option className=''>Filter by category</option>
                    <option className=''>Regulator</option>
                    <option className=''>Capacitor</option>
                </select> */}



                {/* <CategoryDropdown label="Filter by category" onValueChange={setCategoryFilter} /> */}

                <h1 className='font-bold text-[1.2rem] text-blue-800'>PNGEN - V.01</h1>

                <input placeholder='Search MPN' onChange={handleSearch} value={searchQuery} className='outline-none px-3  border py-2 bg-gray-50 rounded-full focus:border-blue-300' />

                <button className='bg-blue-500  rounded-md text-white px-3 py-2'>Add New +</button>
            </div>
            <div className='flex gap-3'>
                <Autocomplete
                    options={categoryList}

                    id="combo-box-demo"
                    sx={{ width: 250, bgcolor: 'white' }}
                    value={categoryFilter}
                    onChange={handleCategoryFilter}
                    renderInput={(params) => <TextField {...params} label='Filter by category' />}
                />

                <Autocomplete
                    options={subcategoryList}

                    id="combo-box-demo"
                    sx={{ width: 250, bgcolor: 'white' }}
                    value={subCategoryFilter}
                    onChange={handleSubCategoryFilter}
                    renderInput={(params) => <TextField {...params} label='Filter by subcategory' />}
                />

                <Autocomplete
                    options={makes}

                    id="combo-box-demo"
                    sx={{ width: 250, bgcolor: 'white' }}
                    value={makeFilter}
                    onChange={handleMakeFilter}
                    renderInput={(params) => <TextField {...params} label='Filter by make' />}
                />

            </div>
            <div className="bg-white w-full  text-black mt-5">

                <Table data={filteredData} onDelete={fetchData} setEditWindow={setEditWindow} setEditData={setEditData} />

            </div>

            {editWindow &&
                <div className='absolute z-10 bg-white border border-blue-300 rounded-lg p-4 shadow-lg w-[400px] h-[400px] '>
                    <input value={editData[0].mpn} />
                    <input value={editData[0].make} />
                    <DropdownCategory label='Edit category' value={category} onChange={handleCategoryChange} defaultValue={editData[0].category} />
                </div>

            }
        </div>
    )
}
