"use client"

import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import SidePanel from "../_components/SidePanel";
import SpinningLoader from "../_components/SpinningLoader";
import { LogoutButton } from "../_components/Logout/logout";
import { create } from "@mui/material/styles/createTransitions";

export function ConsumableComp() {
    const [categories, setCategories] = useState([])
    const [description, setDescription] = useState('')
    const [unit, setUnit] = useState('')
    const [createCatVisible, setCreateCatVisible] = useState(false)
    const [category, setCategory] = useState(null)
    const [blurBackground, setBlurBackground] = useState(false)
    const [newCategory, setNewCategory] = useState('')
    const [newSubCat, setNewSubcat] = useState('')

    const [choosenCategory, setChoosenCategory] = useState('')
    const [showMessage, setShowMessage] = useState(null)

    const [existString, setExistString] = useState('')
    const [existMessage, setExistMessage] = useState(false)
    const [dataSaving, setDataSaving] = useState(false)

    const [error, setError] = useState(false)

    const [validationWindow, setValidationWindow] = useState(false)
    const confirmButton = useRef(false);

    const saveData = async () => {
        console.log(newCategory)


        if (newCategory === '') {
            setShowMessage('')
            setError("Enter category to proceed")

        }

        if (newCategory) {
            setError('')
            const updated = {
                category: newCategory,
            }
            console.log(updated)
            try {
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
        fetchCategories();

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

    const fetchCategories = async () => {
        const res = await axios.get('/api/fetchConsumableCategories')
        console.log(res.data)
        const names = res.data.map((item) => item.category)
        let uniquenames = [...new Set(names), 'Other'];
        setCategories(uniquenames)

    }
    useEffect(() => {

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

        const updated = {
            category: category,
            description: description,
            unit: unit,
            partialPartNumber: Number(newPartNumber),
            partNumber: npn
        }

        console.log(updated)

        const res = await axios.post('/api/addConsumableMpn/', updated);
        if (res.status === 200) {
            setValidationWindow(false)
            setDataSaving(false)
            setExistMessage(true)
            setExistString("New part number generated: " + npn)
        }
    }
    var confirmGen = false;

    const confirmGenerate = () => {
        confirmGen = true
        confirmButton.current.disabled = true;
        confirmButton.current.style.backgroundColor = 'gray';
        handleGenerate();
    }

    const handleGenerate = async () => {
        setValidationWindow(true)
        console.log(confirmGen)
        if (confirmGen) {
            setDataSaving(true)

            const res = await axios.get('/api/fetchConsMpn', { params: { category: category } })
            console.log(res.data)
            if (res.data === null) {
                saveNewPN(0)
            }
            else {
                generateNewPN(res.data.partNumber);
            }
        }
    }


    const generateNewPN = (number) => {
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

    return (
        <div className={dataSaving === true ? `flex flex-[2] flex-col opacity-[0.5] items-center py-10  justify-center relative` : `flex flex-[2] flex-col items-center py-10   justify-center relative`}>
            <h1 className="text-[2rem] uppercase text-slate-800 my-10 font-bold">Part number generation for Consumables</h1>
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
                <textarea value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="Add UoM" className="border border-gray-400 mt-2 rounded-md py-4 px-3 w-full  outline-none resize-none" />

                <button onClick={handleGenerate} id="generate-btn" type="button" className="bg-green-700 hover:bg-green-600 px-3 w-fit mx-auto py-1 mt-4 rounded-md text-white">Generate Part number</button>

            </div>

            {createCatVisible &&
                <div className="absolute h-full w-full flex items-center justify-center bg-white bg-opacity-90">
                    <div className="relative border border-gray-400 bg-white shadow-lg flex flex-col items-center justify-center z-20 p-3 h-[210px] w-[370px] rounded-lg">
                        <button onClick={closeWindow} className="absolute top-2 right-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm2.78-4.22a.75.75 0 0 1-1.06 0L8 9.06l-1.72 1.72a.75.75 0 1 1-1.06-1.06L6.94 8 5.22 6.28a.75.75 0 0 1 1.06-1.06L8 6.94l1.72-1.72a.75.75 0 1 1 1.06 1.06L9.06 8l1.72 1.72a.75.75 0 0 1 0 1.06Z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <h1 className="font-bold text-center">Add Category</h1>
                        <div className="flex flex-col items-center mt-6 gap-4">
                            <input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Enter category" name="category" className="border p-2 w-[90%] rounded-md" />
                            <button onClick={saveData} type='submit' className="border bg-green-700 text-white mt-2  px-3 py-1 rounded-md">Save</button>
                            {showMessage &&
                                <div>
                                    {showMessage}
                                </div>
                            }

                        </div>
                    </div>
                </div>
            }


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

            <AnimatePresence>

                {validationWindow &&

                    <motion.div
                        className=" absolute z-40 rounded-md h-[100%] w-[100%] bg-white bg-opacity-90 flex flex-col items-center justify-center p-2 text-[0.9rem]">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="flex flex-col bg-white rounded-lg border p-4 shadow-lg w-[400px]">

                            <h1 className="text-[1.2rem] font-bold">Confirmation</h1>
                            <p>Verfiy the data before saving.</p>
                            <div className="  w-full flex  flex-col py-3">
                                <div className="  p-2 w-full">Category: <span className="font-medium">{category} </span></div>
                                <div className="  p-2 w-full">Description: <span className="font-medium">{description} </span></div>

                            </div>
                            <div>
                                <button onClick={() => setValidationWindow(false)} className="border border-green-700 text-black mr-6  px-3 py-1 rounded-md">Back</button>
                                <button ref={confirmButton} onClick={confirmGenerate} className="border bg-green-700 text-white  px-3 py-1 rounded-md">Confirm and Save</button>
                            </div>
                        </motion.div>
                    </motion.div>
                }

            </AnimatePresence>



            {
                dataSaving &&

                <SpinningLoader />
            }
        </div>
    )
}
