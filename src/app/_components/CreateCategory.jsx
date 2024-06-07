import axios from "axios"
import { AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

import { Dropdown } from 'primereact/dropdown';

import { Button } from 'primereact/button';
import SelectInput from "./Select";
import { Autocomplete, TextField } from "@mui/material";
import CategoryDropdown from "./CategoryDropdown";



export default function CreateCategory({ setCatWindowVisible, setBlurBackground, setNewCategory, setNewSubcat, saveNewData }) {
    const [category, setCategory] = useState('')
    const [subcategory, setSubcategory] = useState('')
    const [choosenCategory, setChoosenCategory] = useState('')
    const [showMessage, setShowMessage] = useState(null)

    const [error, setError] = useState(false)

    const saveData = async () => {
        console.log(choosenCategory)
        console.log(category)
        var cat;
        if (choosenCategory !== '') {
            cat = choosenCategory
        }
        if (category !== '') {
            cat = category
        }

        if (choosenCategory === null) {
            setChoosenCategory('')
        }

        if ((choosenCategory !== '') && (category !== '')) {
            setShowMessage('')
            setError("Enter either existing category or new category not both")
        }

        if ((choosenCategory === '') && (category === '')) {
            setShowMessage('')
            setError("Enter category")
        }
        if (subcategory === '') {
            setShowMessage('')
            setError('Enter subcategory')
        }

        if (((choosenCategory === '') && (category !== '') || (choosenCategory !== '') && (category === '')) && subcategory !== '') {
            setError('')
            const updated = {
                category: cat,
                subcategory: subcategory,
                subcatDigits: 2,
            }
            try {

                const res = await axios.post('/api/category/', updated)
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
        setCatWindowVisible(false)
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


    return (
        // <AnimatePresence>

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

                    <CategoryDropdown label="Choose existing category" onValueChange={setChoosenCategory} />

                    <h1 className="font-bold">OR</h1>

                    <input placeholder="Enter new category" className="border rounded-md outline-none p-4" name="category" id="category" value={category} onChange={(e) => { setCategory(e.target.value); setNewCategory(e.target.value) }} />
                </div>
                <div className="flex max-sm:flex-col gap-5 items-center">

                    <input placeholder="Enter subcategory" className="border rounded-md outline-none p-4" name="subcategory" id="subcategory" value={subcategory} onChange={(e) => { setSubcategory(e.target.value); setNewSubcat(e.target.value) }} />

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
        // </AnimatePresence>
    )
}