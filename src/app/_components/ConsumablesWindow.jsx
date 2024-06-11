import { Autocomplete, TextField } from "@mui/material";
import CategoryDropdown from "./CategoryDropdown";
import { useEffect, useState } from "react";
import axios from "axios";
import CreateCategory from "./CreateCategory";
import { AnimatePresence, motion } from "framer-motion";
export default function ConsumablesWindow() {
    const [categories, setCategories] = useState([])
    const [description, setDescription] = useState('')
    const [createCatVisible, setCreateCatVisible] = useState(false)
    const [category, setCategory] = useState(null)
    const [blurBackground, setBlurBackground] = useState(false)
    const [newCategory, setNewCategory] = useState('')
    const [newSubCat, setNewSubcat] = useState('')
    const [existString, setExistString] = useState('')
    const [existMessage, setExistMessage] = useState(false)

    const [choosenCategory, setChoosenCategory] = useState('')
    const [showMessage, setShowMessage] = useState(null)

    const [error, setError] = useState(false)

    const saveData = async () => {
        console.log(choosenCategory)
        console.log(newCategory)
        console.log(newSubCat)
        var cat;
        if (choosenCategory !== '') {
            cat = choosenCategory
        }
        if (newCategory !== '') {
            cat = newCategory
        }

        if (choosenCategory === null) {
            setChoosenCategory('')
        }

        if ((choosenCategory !== '') && (newCategory !== '')) {
            setShowMessage('')
            setError("Enter either existing category or new category not both")
        }

        if ((choosenCategory === '') && (newCategory === '')) {
            setShowMessage('')
            setError("Enter category")
        }
        if (newSubCat === '') {
            setShowMessage('')
            setError('Enter subcategory')
        }

        if (((choosenCategory === '') && (newCategory !== '') || (choosenCategory !== '') && (newCategory === '')) && newSubCat !== '') {
            setError('')
            const updated = {
                category: cat,
                subcategory: newSubCat,
            }
            try {
                console.log('in')
                const res = await axios.post('/api/addConsumableCat/', updated)
                console.log(res.data)
                console.log(res.data.message)
                if (res.data.message === 'limit') {
                    setShowMessage('')
                    setError('Cannot enter new subcategory as the maximum limit has reached')
                }
                if (res.data.message === 'saved') {
                    setShowMessage('Successfully saved')
                }


            }
            catch (err) {
                console.log(err)
            }
        }

    }

    const closeWindow = () => {
        setCreateCatVisible(false)
        setBlurBackground(false)
    }

    useEffect(() => {
        if (showMessage) {
            const timer = setTimeout(() => {
                setShowMessage('');
            }, 3000);

            // Cleanup the timeout if the component unmounts or message changes
            return () => clearTimeout(timer);
        }
    }, [showMessage]);


    useEffect(() => {
        const fetchCategories = async () => {
            const res = await axios.get('/api/fetchConsumableCategories')
            console.log(res.data)
            const names = res.data.map((item) => item.category)
            let uniquenames = [...new Set(names), 'Other'];
            setCategories(uniquenames)

        }
        fetchCategories();
    }, [])

    const handleCategoryChange = (e, val) => {
        setCategory(val)
        if (val === 'Other') {
            setCreateCatVisible(true)
            setBlurBackground(true)
        }
    }

    const fetchCatNumber = async () => {
        const res = await axios.get('/api/fetchConsumableCategories')
        if (res.data) {
            const data = res.data;
            console.log(data)
            const cat = data.filter((item) => item.category === category)
            if (cat) {
                var number = cat[0].categoryNumber
                return number
            }
            else {
                return null;
            }
        }
    }
    function sumArray(arr) {
        return arr.reduce((sum, current) => (sum + current), 0);
    }

    const generateChecksum = (number) => {
        var evenDig = [];
        var oddDig = [];
        for (let i = 0; i < number.length; i++) {

            if (i % 2 === 0) {
                var n = String(number[i] * 2)
                if (n.length > 1) {
                    var x = parseInt(n[0]) + parseInt(n[1])
                    console.log(x)
                    evenDig.push(x)
                }
                else {
                    evenDig.push(number[i] * 2)
                }
            }
            else {
                var n = String(number[i] * 3)
                if (n.length > 1) {
                    var x = parseInt(n[0]) + parseInt(n[1])
                    console.log(x)
                    oddDig.push(x)
                }
                else {
                    oddDig.push(number[i] * 3)
                }
            }
        }

        var checksum_first = sumArray(evenDig) % 10
        var checksum_second = sumArray(oddDig) % 10

        console.log(evenDig, oddDig)
        console.log(checksum_first, checksum_second)

        number = parseInt(number + checksum_first + checksum_second)

        return number
    }



    const saveNewPN = async (number) => {
        // setData((prevData) => ({
        //   ...prevData,
        //   mpn: mpn,
        //   make: make,
        //   partNumber: number,
        // })); 
        var categoryNumber = await fetchCatNumber();
        console.log(categoryNumber)
        var newPartNumber;

        if (number === 0) {
            categoryNumber = categoryNumber.toString().padStart(2, '0')
            newPartNumber = `4${categoryNumber}00001`
            var npn = generateChecksum(newPartNumber)
            console.log(npn)

        }

        else {
            newPartNumber = (number.toString().slice(0, 8))
            npn = number
        }

        console.log(newPartNumber, npn)

        // if (number == 0) {
        //   newPartNumber = `1${category}${subcategory}001`
        //   newPartNumber = parseInt(newPartNumber)
        // }
        // else {
        //   newPartNumber = number
        // }

        const updated = {
            category: category,
            description: description,
            partialPartNumber: Number(newPartNumber),
            partNumber: npn
        }

        console.log(updated)

        const res = await axios.post('/api/addConsumableMpn/', updated);
        if (res.status === 200) {
            setExistMessage(true)
            setExistString("New part number generated: " + npn)
        }
    }










    const handleGenerate = async () => {
        const res = await axios.get('/api/fetchConsMpn', { params: { category: category } })
        if (res.data === null) {
            saveNewPN(0)
        }
        else {
            generateNewPN(res.data.partNumber);
        }


        // var partNumber = `4${}`

        // const newRow = {
        //     category: category,
        //     description: description,
        //     partNumber: partNumber,
        //     partialPartNumber: partialPartNumber
        // }

        // const res = axios.post('/api/addConsumableMpn')
    }


    const generateNewPN = (number) => {
        console.log(number)
        var partStr = String(number)
        partStr = partStr.toString().slice(0, 8)
        console.log(partStr)



        var lastDigits = partStr.toString().slice(-5)
        console.log(lastDigits)
        if (lastDigits === '999') {
            setExistString('Cannot generate new part number as maximum limit has reached')
            setExistMessage(true)
        }
        else {
            var incrementedDigits = parseInt(lastDigits, 10) + 1;
            incrementedDigits = ("00000" + incrementedDigits).slice(-3);
            var newPartNumber = String(partStr.slice(0, -3) + incrementedDigits);
            var npn = generateChecksum(newPartNumber)

            console.log("New Part Number:- ", npn)
            saveNewPN(npn);
        }
    }

    // const saveData = () => {
    //     const res = axios.post('/api/addConsumableCat/', { category: newCategory, subcategory: newSubCat })
    //     console.log(res)
    // }

    return (
        <div className={`flex items-center justify-center`}>
            <div className="flex flex-col">

                <Autocomplete
                    options={categories}
                    onChange={handleCategoryChange}
                    value={category}
                    disablePortal
                    id="combo-box-demo"
                    sx={{ width: 300, bgcolor: 'white' }}
                    renderInput={(params) => <TextField  {...params} label="Choose Category" />}
                />
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add description" className="border border-gray-400 mt-2 rounded-md py-4 px-3 w-full  outline-none resize-none" />
                <button onClick={handleGenerate} id="generate-btn" type="button" className="bg-green-700 hover:bg-green-600 px-3 w-fit mx-auto py-1 rounded-md text-white">Generate Part number</button>

            </div>

            {/* {createCatVisible &&
                <CreateCategory setCatWindowVisible={setCreateCatVisible} setBlurBackground={setBlurBackground} setNewCategory={setNewCategory} setNewSubcat={setNewSubcat} saveData={saveData} />
            } */}

            <AnimatePresence>

                {existMessage &&
                    <motion.div initial={{ y: -500 }} animate={{ y: 0 }} exit={{ y: -500 }} className="absolute top-5 py-[10px] px-[15px] bg-slate-600 text-white flex  items-center justify-center gap-3  rounded-md shadow-sm shadow-black ">
                        <h1 className="">{existString}</h1>
                        <button onClick={() => setExistMessage(false)} className="">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm2.78-4.22a.75.75 0 0 1-1.06 0L8 9.06l-1.72 1.72a.75.75 0 1 1-1.06-1.06L6.94 8 5.22 6.28a.75.75 0 0 1 1.06-1.06L8 6.94l1.72-1.72a.75.75 0 1 1 1.06 1.06L9.06 8l1.72 1.72a.75.75 0 0 1 0 1.06Z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </motion.div>
                }
            </AnimatePresence>







            {
                createCatVisible &&

                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}

                    className="absolute z-20 p-10 max-sm:px-3 flex flex-col items-center justify-center text-black bg-gray-100 shadow-lg rounded-lg ">
                    <div className="absolute top-2 right-2">
                        <button onClick={closeWindow}>

                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>

                    </div>
                    <h1 className="text-[1.2rem] font-bold mb-5">Add Category or Subcategory</h1>
                    <div className="flex flex-col gap-2 ">
                        <div className="flex max-sm:flex-col justify-evenly items-center gap-3 bg-gray-200 p-2">

                            <Autocomplete
                                options={categories}
                                onChange={(e, val) => setChoosenCategory(val)}
                                value={choosenCategory}
                                disablePortal
                                id="combo-box-demo"
                                sx={{ width: 300, bgcolor: 'white' }}
                                renderInput={(params) => <TextField  {...params} label="Choose existing category" />}
                            />

                            <h1 className="font-bold">OR</h1>

                            <input placeholder="Enter new category" className="border rounded-md outline-none p-4" name="category" id="category" value={newCategory} onChange={(e) => { setNewCategory(e.target.value) }} />
                        </div>
                        <div className="flex max-sm:flex-col gap-5 items-center">

                            <input placeholder="Enter subcategory" className="border rounded-md outline-none p-4" name="subcategory" id="subcategory" value={newSubCat} onChange={(e) => { setNewSubcat(e.target.value) }} />

                            <div className="w-[250px] ">

                                {showMessage &&
                                    <motion.span
                                        className="text-[1rem] bg-green-600 p-2 text-white rounded-md">{showMessage}</motion.span>
                                }

                                {error &&
                                    <span className="text-[0.8rem] text-red-600">*{error}</span>
                                }
                            </div>
                        </div>


                    </div>
                    <button className="bg-green-500 text-white px-5 py-2 rounded-md mt-5" onClick={saveData}>SAVE</button>

                </motion.div>
            }
        </div>
    )
}