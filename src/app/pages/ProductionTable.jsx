import { Autocomplete, TextField } from "@mui/material";
import ProductionTable from "../_components/ProductionTable";
import axios from "axios";
import { useEffect, useState } from "react";
import ProjectDropdown from "../_components/Production/ProjectDropdown";
import { useScroll } from "framer-motion";
import CategoryDropdownProduction from "../_components/Production/CategoryDropdown";
import SpinningLoader from "../_components/SpinningLoader";
import BCDropdown from "../_components/BCDropdown/BCDropdown";
import { FaArrowsRotate } from "react-icons/fa6";

export function ProductionTablePage() {
    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [projectFilter, setProjectFilter] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [searchType, setSearchType] = useState('0')
    const [dataLoading, setDataLoading] = useState(false)


    const fetchData = async () => {
        setDataLoading(true)
        const res = await axios.get('/api/table', {
            params: {
                broadCategory: 'Production'
            }
        })
        if (res.data) {
            setData(res.data)
            setFilteredData(res.data)
            setDataLoading(false)
        }

    }

    const filterProject = (e, val) => {
        if (val) {
            const filtered = filteredData.filter(item => item.project === val)
            console.log(filtered)
            setFilteredData(filtered)
        }
        else {
            setFilteredData(data)
        }
    }

    const filterCategory = (e, val) => {
        if (val) {
            const filtered = filteredData.filter(item => item.category === val)
            console.log(filtered)
            setFilteredData(filtered)
        }
        else {
            setFilteredData(data)
        }
    }

    const handleSearchChange = (e) => {
        var val = e.target.value
        setSearchQuery(val)
        if (searchType == '0') {
            const filtered = data.filter(item => item.partNumber.toString().includes(val))
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
    }


    useEffect(() => {
        fetchData();
    }, [])

    return (
        <div className=' min-h-[100vh] flex flex-col'>
            <div className='flex items-center justify-between gap-3 px-8'>
                <div className="px-3  border py-2 bg-gray-50 rounded-full">

                    <input value={searchQuery} onChange={handleSearchChange} placeholder='Search' className='outline-none bg-gray-50  focus:border-blue-300' />
                    <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className="bg-gray-50 outline-none text-gray-600 text-[0.8rem]">
                        <option value='0' className="border-none p-2">Part number</option>
                        <option value='1' className="border-none p-2">Description</option>
                    </select>
                </div>
                <div className="flex gap-3">

                    <ProjectDropdown onChange={filterProject} />
                    <CategoryDropdownProduction onChange={filterCategory} />
                </div>
                <button onClick={handleDataRefresh} className="flex bg-blue-800 text-white items-center gap-2  p-2 rounded-md border border-gray-300 text-[0.9rem] hover:bg-gray-100">
                    <FaArrowsRotate />
                    <span>Refresh data</span>
                </button>
            </div>

            <ProductionTable data={filteredData} />



            {dataLoading && <SpinningLoader />}




        </div>
    )
}