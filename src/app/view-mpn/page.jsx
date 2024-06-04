"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'

function ViewMPN() {

    const [data, setData] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get('/api/table')
            console.log(res.data)
            setData(res.data)
        }
        fetchData();
    }, [])

    return (
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
                </tr>
            </thead>
            <tbody className="">
                {data && data.map((item) => {
                    return (
                        <tr key={item._id} className="text-[0.9rem] hover:bg-gray-100">
                            <td className="text-center border-t p-2">{item.mpn}</td>
                            <td className="text-center border-t p-2">{item.make}</td>
                            <td className="text-center border-t p-2">{item.category}</td>
                            <td className="text-center border-t p-2">{item.subcategory}</td>
                            <td className="text-center border-t p-2">{item.partNumber}</td>
                            <td className="text-center border-t p-2">{item.partialPartNumber}</td>
                            <td className="text-center border-t p-2">{item.description}</td>

                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

export default ViewMPN;