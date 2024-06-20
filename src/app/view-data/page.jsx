"use client"
import axios from "axios"
import { use, useEffect, useState } from "react"
import Table from "../_components/Table";
import { Autocomplete, TextField } from '@mui/material';
import SpinningLoader from "../_components/SpinningLoader";
import ProductionTable from "../_components/ProductionTable";
import ConsumableTable from "../_components/ConsumableTable";
import Cookies from "js-cookie";
import { ProductionTablePage } from "../pages/ProductionTable";
import { FaArrowsRotate } from 'react-icons/fa6'
import Consumable from "../consumable/page";
import ViewConsumable from "./consumable/page";
import { LogoutButton } from "../_components/Logout/logout";

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
    const [searchType, setSearchType] = useState('0')

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
        if (broadCategory) {

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

    const handleDataRefresh = () => {
        setFilteredData([])
        fetchData();
        fetchMake();
        fetchCategoryData();
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

    const handleSearchChange = (e) => {
        var val = e.target.value
        setSearchQuery(val)
        if (searchType == '0') {

            const filtered = data.filter((item) => item.mpn.replace(/\s+/g, '').toLowerCase().includes(val.replace(/\s+/g, '').toLowerCase()))
            setFilteredData(filtered)

        }
        else if (searchType == '2') {
            const filtered = data.filter(item =>
                item.description.replace(/\s+/g, '').toLowerCase().includes(val.replace(/\s+/g, '').toLowerCase())
            );
            console.log(filtered)
            setFilteredData(filtered)
        }
        else {
            const filtered = data.filter(item => item.partNumber.toString().includes(val))
            setFilteredData(filtered)
        }
    }

    const getOptionLabel = (option) => {
        if (!option) {
            return ''; // Return empty string if option is null or undefined
        }
        return `${broadCategories.indexOf(option) + 1}. ${option}`;
    };

    // useEffect(() => {
    //     const username = Cookies.get('name')
    //     const broadCat = Cookies.get('broadCategory')
    //     console.log(username, broadCat)
    //     setBroadCategory(broadCat)
    // }, [])

    const Table = () => {

        switch (broadCategory) {
            case 'Production':
                return <ProductionTablePage />
            case 'Consumable':
                return <ViewConsumable data={filteredData} />

            default:
                return (
                    <div>
                        <div className="absolute">


                        </div>
                        <div className='flex flex-wrap items-center justify-between gap-3 '>


                            {/* <div className="flex items-center px-3 gap-4  border py-2 bg-gray-50 rounded-full focus:border-blue-300">
                                <IoSearch size={20} color="gray" />
                                <input placeholder='Search MPN' onChange={handleSearch} value={searchQuery} className='outline-none bg-gray-50 ' />
                            </div> */}
                            <div className="px-3  border py-2 glow bg-gray-50 rounded-full">

                                <input value={searchQuery} onChange={handleSearchChange} placeholder='Search' className='outline-none bg-gray-50   focus:border-blue-300' />
                                <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className="bg-gray-50 text-center  outline-none text-gray-600 text-[0.8rem]">
                                    <option value='0' className="border-none p-2 option">MPN</option>
                                    <option value='1' className="border-none p-2 option">Part number</option>
                                    <option value='2' className="border-none p-2 option">Description</option>
                                </select>
                            </div>
                            <div className="flex gap-3">
                                <Autocomplete
                                    options={categoryList}
                                    size="small"
                                    id="combo-box-demo"
                                    sx={{ width: 200, bgcolor: 'white' }}
                                    value={categoryFilter}
                                    onChange={handleCategoryFilter}
                                    renderInput={(params) => <TextField {...params} label='Filter by category' />}
                                />

                                <Autocomplete
                                    options={subcategoryList}
                                    size="small"
                                    id="combo-box-demo"
                                    sx={{ width: 200, bgcolor: 'white' }}
                                    value={subCategoryFilter}
                                    onChange={handleSubCategoryFilter}
                                    renderInput={(params) => <TextField {...params} label='Filter by subcategory' />}
                                />

                                <Autocomplete
                                    options={makes}
                                    size="small"
                                    id="combo-box-demo"
                                    sx={{ width: 200, bgcolor: 'white' }}
                                    value={makeFilter}
                                    onChange={handleMakeFilter}
                                    renderInput={(params) => <TextField {...params} label='Filter by make' />}
                                />
                            </div>

                            <button onClick={handleDataRefresh} className="flex bg-blue-800 items-center gap-2 text-white  p-2 rounded-md border border-gray-300 text-[0.9rem] hover:bg-blue-600">
                                <FaArrowsRotate />
                                <span>Refresh data</span>
                            </button>

                        </div>

                        <div className="bg-white w-full  text-black mt-5">

                            <table className="w-full">
                                <thead className="text-blue-500 bg-blue-50">
                                    <tr className='text-[0.9rem] font-normal'>
                                        <th className="w-[fit-content] p-3 font-semibold ">S.No.</th>
                                        <th className="w-[fit-content] p-3 font-semibold ">Mpn</th>
                                        <th className="w-[fit-content] p-3 font-semibold ">Make</th>
                                        <th className="w-[fit-content] p-3 font-semibold ">Category</th>
                                        <th className="w-[fit-content] p-3 font-semibold ">Subcategory</th>
                                        <th className="w-[fit-content] p-3 font-semibold ">Part Number</th>
                                        <th className="w-[fit-content] p-3 font-semibold ">Description</th>
                                    </tr>
                                </thead>
                                <tbody className="">
                                    {filteredData && filteredData.map((item, index) => {
                                        return (
                                            <tr key={item._id} className={`text-[0.9rem] hover:bg-blue-50 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
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
                    </div>
                )
        }
    }

    return (

        <div className='px-[60px] min-h-[100vh] py-[20px] flex flex-col'>
            <div className='flex w-full items-center justify-between my-4  bg-blue-50 p-4 px-10 rounded-lg'>
                <h1 className='font-bold text-[1.2rem] text-blue-800'>PNGEN - V.01</h1>
                <h1 className="font-bold text-[1.7rem] text-blue-800 uppercase">{broadCategory}</h1>
                <div className="flex items-center">
                    <Autocomplete
                        options={broadCategories}
                        getOptionLabel={getOptionLabel}
                        id="combo-box-demo"
                        sx={{ width: 250, bgcolor: 'white' }}
                        value={broadCategory}
                        onChange={handleBroadCategoryChange}
                        renderInput={(params) => <TextField {...params} label='Choose broad category' />}
                    />


                    <LogoutButton />

                </div>

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

