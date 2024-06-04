import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useState } from 'react';
import { deleteMpn } from '@/lib/actions';

export default function Table({ data, setEditWindow, setEditData }) {
    const [products, setProducts] = useState([]);

    const handleDelete = async (id) => {
        const formData = new FormData();
        formData.append('id', id);

        await deleteMpn(formData);
        onDelete(); // Call the onDelete callback to trigger data re-fetch

    }

    const handleEdit = (e, id) => {
        e.preventDefault();
        console.log(id)
        const row = data.filter(item => item._id === id)
        console.log(row)
        setEditWindow(true)
        setEditData(row)

    }
    return (

        // <DataTable value={products} tableStyle={{ minWidth: '50rem' }}>

        // </DataTable>
        <>
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
                <tbody className="">
                    {data.map((item) => {
                        return (
                            <tr key={item._id} className="text-[0.9rem] hover:bg-gray-100">
                                <td className="text-center border-t p-2">{item.mpn}</td>
                                <td className="text-center border-t p-2">{item.make}</td>
                                <td className="text-center border-t p-2">{item.category}</td>
                                <td className="text-center border-t p-2">{item.subcategory}</td>
                                <td className="text-center border-t p-2">{item.partNumber}</td>
                                <td className="text-center border-t p-2">{item.partialPartNumber}</td>
                                <td className="text-center border-t p-2">{item.description}</td>
{/*                                 <td className="text-center border-t p-2">
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
            </table>


        </>
    )
}
