"use client"
import SpinningLoader from "@/app/_components/SpinningLoader"
import { Autocomplete, TextField } from "@mui/material"
import { useEffect, useState } from "react"
import { FaArrowsRotate } from "react-icons/fa6"

export default function ViewConsumable() {
    const [dataLoading, setDataLoading] = useState(false)
    const [filteredData, setFilteredData] = useState([]);
    const [data, setData] = useState([]);
    const [categories, setCategories] = useState([])
    const [categoryFilter, setCategoryFilter] = useState('')
    const [searchType, setSearchType] = useState(0)

    const fetchData = async () => {
        setDataLoading(true)
        const res = await fetch('/api/fetchConsMpn/',
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
    const fetchCategories = async () => {
        const res = await fetch('/api/fetchConsumableCategories/',
            {
                cache: 'no-store'
            }
        )
        const data = await res.json()
        const cats = data.map(item => item.category)
        setCategories(cats)

    }

    const handleCategoryFilter = (e, val) => {
        setCategoryFilter(val)
        if (val) {
            const filtered = data.filter(item => item.category === val)
            setFilteredData(filtered)
        }
        else {
            setFilteredData(data)
        }
    }

    const handleSearchChange = (e) => {
        var val = e.target.value
        console.log(searchType)
        if (searchType == '0') {
            const filtered = data.filter(item => item.partNumber.toString().includes(val))
            console.log(filtered)
            setFilteredData(filtered)
        }
        else {
            const filtered = data.filter(item =>
                item.description.replace(/\s+/g, '').toLowerCase().includes(val.replace(/\s+/g, '').toLowerCase())
            );
            console.log(filtered)
            setFilteredData(filtered)
        }
    }

    const handleDataRefresh = () => {
        setFilteredData([])
        fetchData();
        fetchCategories();
    }

    useEffect(() => {
        fetchData();
        fetchCategories();
    }, [])

    return (
        <div className=' min-h-[100vh]  flex flex-col'>
            <div className='flex items-center  justify-between gap-3'>

                <div className="px-3  border py-2 bg-gray-50 rounded-full">

                    <input onChange={handleSearchChange} placeholder='Search' className='outline-none bg-gray-50  focus:border-blue-300' />
                    <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className="bg-gray-50 outline-none text-gray-600 text-[0.8rem]">
                        <option value='0' className="border-none">Part number</option>
                        <option value='1' className="border-none">Description</option>
                    </select>
                </div>

                <Autocomplete
                    options={categories}
                    id="combo-box-demo"
                    size="small"
                    sx={{ width: 300, bgcolor: 'white' }}
                    value={categoryFilter}
                    onChange={handleCategoryFilter}
                    renderInput={(params) => <TextField {...params} label='Filter by category' />}
                />

                <button onClick={handleDataRefresh} className="flex bg-blue-800 text-white items-center gap-2  p-2 rounded-md border border-gray-300 text-[0.9rem] hover:bg-gray-100">
                    <FaArrowsRotate />
                    <span>Refresh data</span>
                </button>


            </div>
            <div className="bg-white w-full  text-black mt-5">
                {/* <Table data={data} onDelete={fetchData} setEditWindow={setEditWindow} setEditData={setEditData} /> */}
                <table className="w-full">
                    <thead className="text-blue-500 bg-blue-50">
                        <tr className='text-[0.9rem] font-normal'>
                            <th className="w-[fit-content] p-3 font-semibold ">S.No.</th>
                            <th className="w-[fit-content] p-3 font-semibold ">Category</th>
                            <th className="w-[fit-content] p-3 font-semibold ">Part Number</th>
                            <th className="w-[fit-content] p-3 font-semibold ">Description</th>
                        </tr>
                    </thead>
                    {
                        dataLoading ? <div className="">
                            <SpinningLoader />
                        </div> :
                            <tbody className="">
                                {filteredData && filteredData.map((item, index) => {
                                    return (
                                        <tr key={item._id} className={`text-[0.9rem] hover:bg-blue-50 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
                                            <td className="text-center border-t p-2">{index + 1}</td>
                                            <td className="text-center border-t p-2">{item.category}</td>
                                            <td className="text-center border-t p-2">{item.partNumber}</td>
                                            <td className="text-center border-t p-2">{item.description}</td>

                                        </tr>
                                    )
                                })}
                            </tbody>
                    }
                </table>
            </div>
        </div>
    )
}