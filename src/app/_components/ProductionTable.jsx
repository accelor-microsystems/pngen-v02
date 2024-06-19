const ProductionTable = ({ data }) => {
    return (
        <div className="bg-white w-full  text-black mt-5">

            <table className="w-full">
                <thead className="text-blue-500 bg-blue-50">
                    <tr className='text-[0.9rem] font-normal'>
                        <th className="w-[fit-content] p-3 font-semibold ">S. No.</th>
                        <th className="w-[fit-content] p-3 font-semibold ">Project</th>
                        <th className="w-[fit-content] p-3 font-semibold ">Assembly Category</th>
                        <th className="w-[fit-content] p-3 font-semibold ">Part Number</th>
                        <th className="w-[fit-content] p-3 font-semibold ">Description</th>
                    </tr>
                </thead>
                <tbody className="">

                    {data && data.map((item, index) => {

                        return (
                            <tr key={item._id} className={`text-[0.9rem] hover:bg-blue-50 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>

                                <td className="text-center text-black border-t p-2">{index + 1}</td>
                                <td className="text-center text-black border-t p-2">{item.project}</td>
                                <td className="text-center text-black border-t p-2">{item.category}</td>
                                <td className="text-center text-black border-t p-2">{item.partNumber}</td>
                                <td className="text-center text-black border-t p-2">{item.description}</td>
                            </tr>
                        )

                    })
                    }


                </tbody>

            </table>
        </div>
    )
}

export default ProductionTable;