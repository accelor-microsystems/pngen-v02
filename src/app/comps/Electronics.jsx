"use client"
import axios from "axios";
import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CreateCategory from "../_components/CreateCategory";
import { Dropdown } from "primereact/dropdown";
import { Autocomplete, TextField } from "@mui/material";
import Login from "../login/page";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SpinningLoader from "../_components/SpinningLoader";
import ConsumablesWindow from "../_components/ConsumablesWindow";
import SidePanel from "../_components/SidePanel";


export default function ElectronicsComp({ broadCategory }) {
    const router = useRouter();
    const [mpn, setMpn] = useState('');
    const [make, setMake] = useState('');
    const [existString, setExistString] = useState('')
    const [existMessage, setExistMessage] = useState(false)
    const [data, setData] = useState(null)
    const [catWindowVisible, setCatWindowVisible] = useState(false)

    const [subcategories, setSubcategories] = useState([]);

    const [makes, setMakes] = useState([])

    const [choosenCategory, setChoosenCategory] = useState('')
    const [choosenSubcategory, setChoosenSubcategory] = useState('')

    const [loggedIn, setLoggedIn] = useState(false)
    const [description, setDescription] = useState('')

    const [unit, setUnit] = useState('')
    // const [broadCategory, setBroadCategory] = useState('')

    const [dataSaving, setDataSaving] = useState(false)
    const [addMakeWindow, setAddMakeWindow] = useState(false)
    const [blurBackground, setBlurBackground] = useState(false)
    const [newMake, setNewMake] = useState('')

    const [makeAddMessage, setMakeAddMessage] = useState(null)
    const [broadCategories, setBroadCategories] = useState([])
    const [broadCategorynames, setBroadCategorynames] = useState([])

    const [consumableWindow, setConsumableWindow] = useState(false)
    const [categories, setCategories] = useState([])
    const [confirmationWindow, setConfirmationWindow] = useState(false)

    const [generateWindowShow, SetGenerateWindowShow] = useState(false)

    const confirmButton = useRef(false);

    var subcatDigits = 2;
    var categoryNumber = 0;
    var subcategoryNumber = 0;

    const handleMakeSave = async () => {
        setDataSaving(true)
        const res = await axios.post('/api/newMake', { make: newMake, broadCategory: broadCategory })
        console.log(res)
        if (res.status === 200) {
            setDataSaving(false)
            setMakeAddMessage(res.data.make)
            fetchMake();
        }
    }

    const handleSearch = async (e) => {
        e.preventDefault();
        if (mpn && make) {
            setDataSaving(true)
            var data = await checkMpnMake();
            if (data != null) {

                // console.log(data)
                setData(data)
                setDataSaving(false)
                setExistString('MPN and MAKE already exists. Part number: ' + data.partNumber)
                setExistMessage(true)
            }
            else {
                setDataSaving(false)
                setExistString('MPN and MAKE does not exists. You may enter category and subcategory to proceed')
                setExistMessage(true)
            }
        }
        else {
            setExistMessage(true)
            setExistString('You have not entered both MPN and Make')
        }
    }

    const checkMpnMake = async () => {

        try {
            const res = await axios.get('/api/mpn/', {
                params: { mpn, make, broadCategory },
            });
            console.log(res.data)
            if (!res.data) {
                SetGenerateWindowShow(true)
            }

            return res.data;

        }
        catch (err) {
            console.log(err)
        }

    }

    const fetchSubcatDigits = async (categoryToFind, subcategoryToFind) => {
        try {
            const res = await axios.get('/api/category', {
                params: {
                    broadCategory: broadCategory
                }
            });
            var data = res.data;
            // const w = data.find(cat => cat.category === categoryToFind)
            const num = data.find(cat => cat.category === categoryToFind && cat.subcategory === subcategoryToFind)
            console.log(num)
            // subcatDigits = w.subcatDigits
            categoryNumber = num.categoryNumber
            subcategoryNumber = num.subcatNumber


        }
        catch (err) {
            console.log(err)
        }
    }
    let confirmSaveFlag = false;

    function confirmSave() {
        confirmSaveFlag = true;
        confirmButton.current.disabled = true;
        confirmButton.current.style.backgroundColor = 'gray';
        handleGenerate();
    }


    const handleGenerate = async () => {
        if (mpn && make && choosenCategory && choosenSubcategory) {
            const data = await checkMpnMake();
            console.log(data)
            if (data) {
                setConfirmationWindow(false)
                setExistString('MPN and MAKE already exists. Part number: ' + data.partNumber)
                setExistMessage(true)
            }
            else {

                if (confirmSaveFlag) {
                    if (choosenCategory && choosenSubcategory && description) {
                        setDataSaving(true)

                        try {
                            await fetchSubcatDigits(choosenCategory, choosenSubcategory)

                            const res = await axios.get('/api/mpn/', {
                                params: { choosenCategory, choosenSubcategory, broadCategory },
                                cache: "no-store"
                            });
                            console.log(res.data)
                            if (res.data == null) {
                                // setExistMessage(true)
                                // setExistString("Category and Subcategory does not exist")
                                saveNewPN(0)
                                setDataSaving(false)
                            }
                            else {
                                console.log(res.data)
                                // setData(res.data)
                                generateNewPN(res.data.partNumber);
                                setDataSaving(false)
                            }
                        }
                        catch (err) {
                            console.log(err)
                        }

                    }
                    else {
                        setExistMessage(true)
                        setExistString('Enter all the values to proceed')
                    }
                }
            }
        }
        else {
            setExistMessage(true)
            setExistString('Enter all the values to proceed')
        }

    }



    function sumArray(arr) {
        return arr.reduce((sum, current) => (sum + current), 0);
    }

    const generateNewPN = (number) => {
        console.log(number)
        var partStr = String(number)
        partStr = partStr.toString().slice(0, 8)
        console.log(partStr)



        var lastDigits = partStr.toString().slice(-3)
        console.log(lastDigits)
        if (lastDigits === '999') {
            setExistString('Cannot generate new part number as maximum limit has reached')
            setExistMessage(true)
        }
        else {
            var incrementedDigits = parseInt(lastDigits, 10) + 1;
            incrementedDigits = ("000" + incrementedDigits).slice(-3);
            var newPartNumber = String(partStr.slice(0, -3) + incrementedDigits);
            var npn = generateChecksum(newPartNumber)

            console.log("New Part Number:- ", npn)
            saveNewPN(npn);
        }
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
        console.log(mpn, make)

        var newPartNumber;
        await fetchSubcatDigits();

        console.log(subcatDigits, categoryNumber, subcategoryNumber)

        if (number === 0) {
            categoryNumber = categoryNumber.toString().padStart(2, '0')
            subcategoryNumber = subcategoryNumber.toString().padStart(2, '0')
            if (broadCategory === 'Electronics')
                newPartNumber = `1${categoryNumber}${subcategoryNumber}001`
            if (broadCategory === 'Mechanical')
                newPartNumber = `2${categoryNumber}${subcategoryNumber}001`
            if (broadCategory === 'Tools and Equipments')
                newPartNumber = `6${categoryNumber}${subcategoryNumber}001`
            if (broadCategory === 'Electronics (Non COC)')
                newPartNumber = `8${categoryNumber}${subcategoryNumber}001`
            if (broadCategory === 'Mechanical (Non COC)')
                newPartNumber = `9${categoryNumber}${subcategoryNumber}001`
            var npn = generateChecksum(newPartNumber)
            console.log(npn)

        }

        else {
            newPartNumber = (number.toString().slice(0, 8))
            npn = number
        }

        console.log(newPartNumber, npn)


        const updated = {
            mpn: mpn,
            make: make,
            category: choosenCategory,
            subcategory: choosenSubcategory,
            description: description,
            unit: unit,
            partialPartNumber: Number(newPartNumber),
            partNumber: npn,
            broadCategory: broadCategory
        }

        console.log(updated)

        const res = await axios.post('/api/mpn/', updated);
        if (res.status === 200) {
            setConfirmationWindow(false)
            setExistMessage(true)
            setExistString("New part number generated: " + npn)
        }

    }


    const handleLogout = () => {
        Cookies.remove('name')
        Cookies.remove('broadCategory')
        router.push('/login')
    }



    useEffect(() => {
        const fetchSubcat = async () => {
            const res = await axios.get('/api/fetchCategories/', {
                params: {
                    broadCategory: broadCategory
                }
            })
            console.log(res.data)
            if (res.data) {

                const allData = res.data;
                const uniqueSubCategories = [...new Set(allData.map(item => item.subcategory))];
                const filteredSubCategories = Array.from(new Set(
                    allData
                        .filter(item => item.category === choosenCategory)
                        .map(item => item.subcategory)
                ));
                console.log(filteredSubCategories)
                setSubcategories(filteredSubCategories);
            }

        }
        fetchSubcat();
        setChoosenSubcategory(null)
    }, [choosenCategory])

    const fetchCategory = async () => {
        try {
            const res = await axios.get('/api/fetchCategories/', {
                params: {
                    broadCategory: broadCategory
                }
            });
            console.log(res.data)
            if (res.data) {

                const allData = res.data;
                const uniqueCategories = [...new Set(allData.map(item => item.category))];
                console.log(uniqueCategories)
                setCategories([...uniqueCategories, "Other"]);
            }

        } catch (error) {
            console.error('Error fetching categories', error);
        }
    };

    const fetchMake = async () => {
        try {
            const res = await axios.get('/api/fetchMakes', {
                params: {
                    broadCategory: broadCategory
                }
            }
            )
            console.log(res.data)

            const allmakes = res.data
            const names = [...new Set(allmakes.map((item) => item.name).filter(name => name))];
            console.log(names)
            setMakes(names)

        }
        catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchMake();
        fetchCategory();
    }, [broadCategory])

    // useEffect(() => {
    //   if (!Cookies.get('name')) {
    //     router.push('/login');
    //   }
    // }, [router]);

    useEffect(() => {
        const fetchBroadCategories = async () => {
            const res = await axios.get('/api/fetchBroadCats')
            console.log(res.data)
            setBroadCategories(res.data)

            const names = res.data.map((item) => item.name)
            setBroadCategorynames(names)
        }
        fetchBroadCategories();
    }, [])

    const handleCategoryChange = (e, val) => {
        setChoosenCategory(val);
        if (val === 'Other') {

            setCatWindowVisible(true)
            setBlurBackground(true)
        }
    }

    const updateData = () => {
        fetchCategory();
    }


    return (
        <div className={dataSaving === true ? `flex items-center  justify-center opacity-[0.5] w-full relative flex-col` : `flex  flex-col items-center w-full relative justify-center opacity-1 `}>
            <h1 className="text-[2rem] text-center uppercase text-slate-800 my-10 font-bold">Part number generation for {broadCategory}</h1>

            <div className={`flex ${blurBackground ? ' brightness-50 blur' : ''} max-sm:flex-col  items-center text-black justify-center w-full h-full  `}>

                <div className="flex gap-10 flex-col h-full w-full items-center justify-center relative ">
                    <button onClick={() => { setAddMakeWindow(true); setBlurBackground(true) }} className=" absolute top-0 left-3 mx-4 bg-slate-700 text-white px-5 py-3 rounded-lg hover:bg-slate-600">Add new Make</button>
                    {consumableWindow ? <ConsumablesWindow /> :
                        <div className="flex max-sm:flex-col  items-baseline gap-14 mt-6">
                            
                            <form className="flex flex-col gap-4 items-center justify-center " onSubmit={handleSearch}>
                                <h1 className="font-bold text-[1.3rem] text-gray-800">Search MPN and Make</h1>
                                <div className="flex flex-col gap-3">

                                    <input className="border border-gray-400 outline-none py-4 px-3 rounded-md w-[300px]" onChange={(e) => setMpn(e.target.value)} value={mpn} placeholder="Enter MPN" type="text" id="mpn" name="mpn" />

                                    {/* <input className="border outline-none p-2 rounded-md w-[300px]" onChange={(e) => setMake(e.target.value)} value={make} placeholder="Enter Make" type="text" id="make" name="make" /> */}
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        value={make}
                                        onChange={(e, val) => setMake(val)}

                                        options={makes}
                                        sx={{ bgcolor: 'white', fontFamily: 'monospace' }}
                                        renderInput={(params) => <TextField  {...params} inputProps={{ ...params.inputProps, style: { fontSize: 14 } }} label="Choose Make" />}
                                    />
                                </div>

                                <div className="flex flex-col  gap-4 justify-center items-center">

                                    <button className="bg-green-700 px-5 w-[fit-content] rounded-md py-1 text-white hover:bg-green-600" type="submit" >Search</button>
                                    {/* <h3 id="part-number" className=""></h3> */}
                                </div>
                            </form>
                            <AnimatePresence>
                                {
                                    generateWindowShow &&

                                    <motion.div
                                        initial={{ x: 800, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ type: 'just' }}
                                        className="flex flex-col gap-4">
                                        <h1 className="font-bold text-[1.3rem]  text-gray-800">Generate part number</h1>
                                        <div className="flex flex-col gap-2 items-center justify-center">
                                            <div className="flex flex-col">
                                                {/* <CategoryDropdown label="Choose category" onValueChange={setChoosenCategory} setCatWindowVisible={setCatWindowVisible} setBlurBackground={setBlurBackground} catWindowVisible={catWindowVisible} /> */}
                                                <Autocomplete
                                                    disablePortal
                                                    id="combo-box-demo"
                                                    value={choosenCategory}
                                                    onChange={handleCategoryChange}

                                                    options={categories}
                                                    sx={{ bgcolor: 'white', width: 300 }}
                                                    renderInput={(params) => <TextField  {...params} label={broadCategory === 'Tools and Equipments' ? 'Choose department' : "Choose category"} />}
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <Autocomplete
                                                    disablePortal
                                                    id="combo-box-demo"
                                                    value={choosenSubcategory}
                                                    onChange={(e, val) => setChoosenSubcategory(val)}

                                                    options={subcategories}
                                                    sx={{ width: 300, bgcolor: 'white' }}
                                                    renderInput={(params) => <TextField  {...params} label={broadCategory === 'Tools and Equipments' ? 'Choose category' : 'Choose subcategory'} />}
                                                />

                                            </div>
                                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add part number description" className="border border-gray-400 rounded-md py-4 px-3 w-full  outline-none resize-none" />
                                            <textarea value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="Add unit" className="border border-gray-400 rounded-md py-4 px-3 w-full  outline-none resize-none" />

                                            {/* <p className="text-[0.8rem] text-gray-500">Category or subcategory not listed?</p> */}
                                            {/* <button onClick={openCategoryWindow} className=" bg-purple-900 px-3 py-2 text-white rounded-md">Add new category</button> */}
                                        </div>
                                        <button onClick={() => setConfirmationWindow(true)} id="generate-btn" type="button" className="bg-green-700 hover:bg-green-600 px-3 w-fit mx-auto py-1 rounded-md text-white">Generate Part number</button>

                                    </motion.div>
                                }
                            </AnimatePresence>
                        </div>
                    }


                    <AnimatePresence>

                        {confirmationWindow &&

                            <motion.div
                                className=" absolute z-40 rounded-md h-[100%] w-[100%] bg-white bg-opacity-90 flex flex-col items-center justify-center p-2 text-[0.9rem]">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    className="flex flex-col bg-white rounded-lg border p-4 shadow-lg w-[400px]">

                                    <h1 className="text-[1.2rem] font-bold mb-3">Confirmation</h1>
                                    <p>Verfiy the data before saving.</p>
                                    <div className="  w-full flex  flex-col py-3">
                                        <div className="  border-t-2 p-2 w-full">MPN: <span className="font-medium">{mpn}</span> </div>
                                        <div className="  p-2 w-full">Make: <span className="font-medium">{make} </span></div>
                                        <div className="  p-2 w-full">{broadCategory === 'Tools and Equipments' ? 'Department: ' : 'Category: '}: <span className="font-medium">{choosenCategory} </span></div>
                                        <div className="  p-2 w-full">{broadCategory === 'Tools and Equipments' ? 'Category: ' : 'Subcategory: '} <span className="font-medium">{choosenSubcategory} </span></div>
                                        <div className="  p-2 w-full">Description: <span className="font-medium">{description} </span></div>
                                    </div>
                                    <div>
                                        <button onClick={() => setConfirmationWindow(false)} className="border border-green-700 text-black mr-6  px-3 py-1 rounded-md">Back</button>
                                        <button ref={confirmButton} onClick={confirmSave} className="border bg-green-700 text-white  px-3 py-1 rounded-md">Confirm and Save</button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        }

                    </AnimatePresence>
                </div>



            </div>

            <AnimatePresence>

                {addMakeWindow &&
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="absolute border border-gray-400 bg-white shadow-lg flex flex-col z-20 p-3 h-[210px] w-[370px] rounded-lg">
                        <button onClick={() => { setAddMakeWindow(false), setBlurBackground(false) }} className="absolute right-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm2.78-4.22a.75.75 0 0 1-1.06 0L8 9.06l-1.72 1.72a.75.75 0 1 1-1.06-1.06L6.94 8 5.22 6.28a.75.75 0 0 1 1.06-1.06L8 6.94l1.72-1.72a.75.75 0 1 1 1.06 1.06L9.06 8l1.72 1.72a.75.75 0 0 1 0 1.06Z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <h1 className="font-bold text-center">Add make</h1>
                        <div className="flex flex-col items-center mt-6 gap-4">

                            <input value={newMake} onChange={(e) => setNewMake(e.target.value)} placeholder="Enter make" name="make" className="border p-2 w-[90%] rounded-md" />
                            <button onClick={handleMakeSave} className="border bg-green-700 text-white  px-3 py-1 rounded-md">Save</button>
                            {makeAddMessage &&
                                <div className="text-green-800">
                                    {makeAddMessage} saved
                                </div>
                            }
                        </div>
                    </motion.div>
                }
            </AnimatePresence>

            <AnimatePresence>

                {catWindowVisible && <CreateCategory setCatWindowVisible={setCatWindowVisible} setBlurBackground={setBlurBackground} broadCategory={broadCategory} onClose={updateData} setLoader={setDataSaving} />}
            </AnimatePresence>
            <AnimatePresence>

                {existMessage &&
                    <motion.div initial={{ y: -500 }} animate={{ y: 0 }} exit={{ y: -500 }} className="absolute -top-4 py-[10px] px-[15px] bg-slate-600 text-white flex  items-center justify-center gap-3  rounded-md shadow-sm shadow-black ">
                        <h1 className="">{existString}</h1>
                        <button onClick={() => setExistMessage(false)} className="">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm2.78-4.22a.75.75 0 0 1-1.06 0L8 9.06l-1.72 1.72a.75.75 0 1 1-1.06-1.06L6.94 8 5.22 6.28a.75.75 0 0 1 1.06-1.06L8 6.94l1.72-1.72a.75.75 0 1 1 1.06 1.06L9.06 8l1.72 1.72a.75.75 0 0 1 0 1.06Z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </motion.div>
                }
            </AnimatePresence>
            {dataSaving && <SpinningLoader />}
        </div>
    )
}
