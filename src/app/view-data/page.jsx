"use client"
import axios from "axios"
import { use, useEffect, useState } from "react"
import Table from "../_components/Table";
import { Autocomplete, TextField } from '@mui/material';
import SpinningLoader from "../_components/SpinningLoader";
import ProductionTable from "../_components/ProductionTable";
import ConsumableTable from "../_components/ConsumableTable";

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
    const [broadCategories, setBroadCategories] = useState([])
    const [broadCategory, setBroadCategory] = useState('');
    const [productionTable, setProductionTable] = useState(false)

    const [showConsumableTable, setShowConsumableTable] = useState(false)
    const [bcMessage, setbcMessage] = useState(true)
    const handleCategoryChange = (e, val) => {
        setCategory(val)
    }

    useEffect(() => {
        const fetchBroadCategories = async () => {
            const res = await axios.get('/api/fetchBroadCats')
            console.log(res.data)

            const names = res.data.map((item) => item.name)
            console.log(names)
            setBroadCategories(names)
        }
        fetchBroadCategories();
    }, [])


    const fetchData = async () => {
        setDataLoading(true)
        const res = await axios.get('/api/table', {
            params: {
                broadCategory: broadCategory
            }
        })

        // console.log(res.data)
        if (res.data) {

            setData(res.data)
            setFilteredData(res.data)
            setDataLoading(false)
        }

    }

    const fetchMake = async () => {
        const res = await axios.get('/api/fetchMakes/', {
            params: {
                broadCategory: broadCategory
            }
        })
        if (res.data) {
            const allmakes = res.data
            const names = allmakes.map((item) => item.name).filter(name => name);
            setMakes(names)
        }
    }

    const fetchCategoryData = async () => {
        try {
            const res = await axios.get('/api/fetchCategories/', {
                params: {
                    broadCategory: broadCategory
                }
            });

            if (res.data) {

                const allData = res.data;
                const uniqueCategories = [...new Set(allData.map(item => item.category))];
                console.log(uniqueCategories)
                setCategoryList([...uniqueCategories]);
            }

        } catch (error) {
            console.error('Error fetching data', error);
        }
    };

    useEffect(() => {
        setFilteredData([])
        fetchData();
        fetchMake();
        fetchCategoryData();

    }, [broadCategory])

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
            const res = await axios.get('/api/fetchCategories/', {
                params: {
                    broadCategory: broadCategory
                }
            })
            if (res.data) {

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

        }
        fetchSubcat();
    }, [categoryFilter])

    const handleBroadCategoryChange = (e, val) => {
        console.log(val)
        if (val === null) {
            setbcMessage(true)
        }
        else
            setbcMessage(false)

        setFilteredData(null)
        setBroadCategory(val)

    }

    const Table = () => {

        switch (broadCategory) {
            case 'Production':
                return <ProductionTable data={filteredData} />
            case 'Consumable':
                return <ConsumableTable data={filteredData} />

            default:
                return (

                    <div className="bg-white w-full  text-black mt-5">

                        <table className="w-full">
                            <thead className="text-blue-500 bg-blue-50">
                                <tr className='text-[0.9rem] font-normal'>
                                    <th className="w-[5%] p-3 font-semibold ">S.No.</th>
                                    <th className="w-[16%] p-3 font-semibold ">Mpn</th>
                                    <th className="w-[16%] p-3 font-semibold ">Make</th>
                                    <th className="w-[16%] p-3 font-semibold ">Category</th>
                                    <th className="w-[16%] p-3 font-semibold ">Subcategory</th>
                                    <th className="w-[16%] p-3 font-semibold ">Part Number</th>
                                    <th className="w-[16%] p-3 font-semibold ">Description</th>
                                </tr>
                            </thead>
                            <tbody className="">
                                {filteredData && filteredData.map((item, index) => {
                                    return (
                                        <tr key={item._id} className="text-[0.9rem] hover:bg-gray-100">
                                            <td className="text-center border-t p-2">{index + 1}</td>
                                            <td className="text-center border-t p-2">{item.mpn}</td>
                                            <td className="text-center border-t p-2">{item.make}</td>
                                            <td className="text-center border-t p-2">{item.category}</td>
                                            <td className="text-center border-t p-2">{item.subcategory}</td>
                                            <td className="text-center border-t p-2">{item.partNumber}</td>
                                            <td className="text-center border-t p-2">{item.description}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>

                        </table>

                    </div>
                )
        }
    }




    return (

        <div className='px-[100px] min-h-[100vh] py-[20px] flex flex-col'>

            <div className='flex w-full items-center justify-between my-4  bg-blue-50 p-4 rounded-full'>

                <h1 className='font-bold text-[1.2rem] text-blue-800'>PNGEN - V.01</h1>

                <input placeholder='Search MPN' onChange={handleSearch} value={searchQuery} className='outline-none px-3  border py-2 bg-gray-50 rounded-full focus:border-blue-300' />

                <button className='bg-blue-500  rounded-md text-white px-3 py-2'>Add New +</button>
            </div>
            <div className='flex items-center justify-center gap-3'>
                <Autocomplete
                    options={broadCategories}

                    id="combo-box-demo"
                    sx={{ width: 250, bgcolor: 'white' }}
                    value={broadCategory}
                    onChange={handleBroadCategoryChange}
                    renderInput={(params) => <TextField {...params} label='Choose broad category' />}
                />

                <>
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
                </>

            </div>

            {Table()}
            {bcMessage &&
                <div className="text-black text-center text-[2rem] mt-10 font-bold ">
                    Choose broad category to view data
                </div>
            }


            {dataLoading && <SpinningLoader />}




        </div>
    )
}

