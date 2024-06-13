"use client"
import SpinningLoader from "@/app/_components/SpinningLoader"
import { Autocomplete, TextField } from "@mui/material"
import { useEffect, useState } from "react"

export default function ViewConsumable() {
    const [dataLoading, setDataLoading] = useState(false)
    const [filteredData, setFilteredData] = useState([]);
    const [data, setData] = useState([]);

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

    useEffect(() => {
        fetchData();
    }, [])

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

                {/* <input placeholder='Search MPN' onChange={handleSearch} value={searchQuery} className='outline-none px-3  border py-2 bg-gray-50 rounded-full focus:border-blue-300' /> */}

                {/* <button className='bg-blue-500  rounded-md text-white px-3 py-2'>Add New +</button> */}
            </div>
            <div className='flex items-center justify-center gap-3'>
                {/* <Autocomplete
                    options={categoryList}

                    id="combo-box-demo"
                    sx={{ width: 250, bgcolor: 'white' }}
                    value={categoryFilter}
                    onChange={handleCategoryFilter}
                    renderInput={(params) => <TextField {...params} label='Filter by category' />}
                /> */}


            </div>
            <div className="bg-white w-full  text-black mt-5">

                {/* <Table data={data} onDelete={fetchData} setEditWindow={setEditWindow} setEditData={setEditData} /> */}
                <table className="w-full">
                    <thead className="text-blue-500 bg-blue-50">
                        <tr className='text-[0.9rem] font-normal'>
                            <th className="w-[16%] p-3 font-semibold ">Category</th>
                            <th className="w-[16%] p-3 font-semibold ">Part Number</th>
                            <th className="w-[16%] p-3 font-semibold ">Description</th>
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