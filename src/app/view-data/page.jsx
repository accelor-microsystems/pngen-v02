"use client"
import axios from "axios"
import { use, useEffect, useState } from "react"
import Table from "../_components/Table";
import { Autocomplete, TextField } from '@mui/material';
import SpinningLoader from "../_components/SpinningLoader";

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

    const [category, setCategory] = useState("")

    const [dataLoading, setDataLoading] = useState(false)

    const handleCategoryChange = (e, val) => {
        setCategory(val)
    }


    const fetchData = async () => {
        setDataLoading(true)
        const res = await fetch('/api/table/',
            {
                cache: 'no-store'
            }
        )
        const data = await res.json()
        console.log(data)
        setData(data)
        setFilteredData(data)
        setDataLoading(false)

    }

    const fetchMake = async () => {
        const res = await axios.get('/api/addMake/')
        const allmakes = res.data
        const names = allmakes.map((item) => item.name).filter(name => name);
        setMakes(names)
    }

    const fetchCategoryData = async () => {
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

    useEffect(() => {

        fetchData();
        fetchMake();
        fetchCategoryData();

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

        <div className='px-[100px] min-h-[100vh] py-[20px] flex flex-col'>

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
            <div className='flex items-center justify-center gap-3'>
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

                {/* <Table data={data} onDelete={fetchData} setEditWindow={setEditWindow} setEditData={setEditData} /> */}
                <table className="w-full">
                    <thead className="text-blue-500 bg-blue-50">
                        <tr className='text-[0.9rem] font-normal'>
                            <th className="w-[16%] p-3 font-semibold ">Mpn</th>
                            <th className="w-[16%] p-3 font-semibold ">Make</th>
                            <th className="w-[16%] p-3 font-semibold ">Category</th>
                            <th className="w-[16%] p-3 font-semibold ">Subcategory</th>
                            <th className="w-[16%] p-3 font-semibold ">Part Number</th>
                            <th className="w-[16%] p-3 font-semibold ">Part Number 2</th>
                            <th className="w-[16%] p-3 font-semibold ">Description</th>
                            <th className="w-[16%] p-3 font-semibold ">Actions</th>
                        </tr>
                    </thead>
                    {
                        dataLoading ? <div className="">
                            <SpinningLoader />

                        </div> :


                            <tbody className="">
                                {filteredData && filteredData.map((item) => {
                                    return (
                                        <tr key={item._id} className="text-[0.9rem] hover:bg-gray-100">
                                            <td className="text-center border-t p-2">{item.mpn}</td>
                                            <td className="text-center border-t p-2">{item.make}</td>
                                            <td className="text-center border-t p-2">{item.category}</td>
                                            <td className="text-center border-t p-2">{item.subcategory}</td>
                                            <td className="text-center border-t p-2">{item.partNumber}</td>
                                            <td className="text-center border-t p-2">{item.partialPartNumber}</td>
                                            <td className="text-center border-t p-2">{item.description}</td>
                                            {/* <td className="text-center border-t p-2">
                                    <form>
                                        <input name='id' type='hidden' value={item._id} />
                                        <button className='mx-4' onClick={(e) => handleEdit(e, item._id)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="green" className="size-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg>
                                        </button>
                                    </form>
                                    <form>
                                        <input name='id' type='hidden' value={item._id} />
                                        <button onClick={() => handleDelete(item._id)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="red" className="size-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>

                                        </button>
                                    </form>
                                </td> */}
                                        </tr>
                                    )
                                })}
                            </tbody>
                    }
                </table>


            </div>

            {/* {editWindow &&
                <div className='absolute z-10 bg-white border border-blue-300 rounded-lg p-4 shadow-lg w-[400px] h-[400px] '>
                    <input value={editData[0].mpn} />
                    <input value={editData[0].make} />
                    <DropdownCategory label='Edit category' value={category} onChange={handleCategoryChange} defaultValue={editData[0].category} />
                </div>

            } */}
        </div>
    )
}
