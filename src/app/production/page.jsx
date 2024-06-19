"use client"
import { Autocomplete, TextField } from "@mui/material";
import SidePanel from "../_components/SidePanel";
import { useEffect, useState } from "react";
import { addProductionCategory, addProductionProject, saveProductionPN } from "@/lib/actions";
import { fetchProductionProjects } from "@/lib/data";
import axios from "axios";
import { generateChecksum } from "@/utils/help";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import SpinningLoader from "../_components/SpinningLoader";

export default function () {
    const [project, setProject] = useState('')
    const [category, setCategory] = useState('')
    const [projects, setProjects] = useState([])
    const [categories, setCategories] = useState([])
    const [description, setDescription] = useState('')
    const [addProjectWindow, setAddProjectWindow] = useState(false);
    const [newProject, setNewProject] = useState('')
    const [addCategoryWindow, setAddCategoryWindow] = useState(false);
    const [projectData, setProjectData] = useState([])
    const [categoryData, setCategoryData] = useState({})
    const [existString, setExistString] = useState('')
    const [existMessage, setExistMessage] = useState(false)
    const [savedMessage, setSavedMessage] = useState(null)
    const [newCategory, setNewCategory] = useState('')
    const [loading, setLoading] = useState(false)

    const handleProjectSave = () => {
        addProductionProject();
    }

    const fetchProductionProjects = async () => {
        try {
            const res = await axios.get('/api/production/fetchProjects')
            if (res.data) {
                console.log(res.data)
                setProjectData(res.data)
                const names = res.data.map(item => item.name)
                console.log(names)
                setProjects(names)
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    const fetchProductionCategories = async () => {
        try {
            const res = await axios.get('/api/production/fetchCategory')
            if (res.data) {
                console.log(res.data)
                setCategoryData(res.data)
                const names = res.data.map(item => item.category)
                console.log(names)
                setCategories(names)
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    function fetchCategoryNumber() {
        const catNum = categoryData.find(item => item.category === category)?.categoryNumber;
        return catNum
    }
    function fetchProjectNumber() {
        const projectNum = projectData.find(item => item.name === project)?.projectNumber;
        return projectNum
    }

    async function fetchPartNumber() {
        var data = null;
        try {
            const res = await axios.get('/api/production/fetchPartnumber/', {
                params: {
                    category: category
                }
            })
            console.log(res.data)
            if (res.data) {
                data = res.data.partialPartNumber
            }

        }
        catch (err) {
            console.log(err)
        }
        return data;
    }

    function incrementPN(partialPN) {
        var partStr = String(partialPN)
        var lastDigits = partStr.toString().slice(-3)

        var incrementedDigits = parseInt(lastDigits, 10) + 1;
        incrementedDigits = ("000" + incrementedDigits).slice(-3);
        var newPartNumber = String(partStr.slice(0, -3) + incrementedDigits);
        return newPartNumber
    }

    const savePN = async (partialPN, newPN) => {
        const newdoc = {
            category: category,
            project: project,
            description: description,
            partialPartNumber: Number(partialPN),
            partNumber: newPN
        }
        console.log(newdoc)
        saveProductionPN(newdoc)
        setExistMessage(true)
        setExistString("Part number generated:- " + newPN)
        setLoading(false)

    }

    const handleGenerate = async () => {
        setLoading(true)
        var newPartNumber;
        var categoryNumber = fetchCategoryNumber();
        var projectNumber = fetchProjectNumber()

        var existingPN = await fetchPartNumber()

        console.log(categoryNumber, projectNumber, existingPN)
        if (!existingPN) {
            newPartNumber = `30${projectNumber}0${categoryNumber}001`
        }
        else {
            newPartNumber = incrementPN(existingPN);
        }
        var npn = generateChecksum(newPartNumber)
        savePN(newPartNumber, npn)

    }

    useEffect(() => {
        fetchProductionProjects();
        fetchProductionCategories();
    }, [])

    const handleAddProject = (e) => {
        if (!newProject) {
            setSavedMessage('Please enter project ')
        }
        else {
            setLoading(true)

            addProductionProject(e)
            setLoading(false)
            setSavedMessage(newProject + " saved")
        }
    }

    const handleAddCategory = (e) => {
        if (!newCategory) {
            setSavedMessage('Please enter category ')
        }
        else {
            setLoading(true)
            addProductionCategory(e)
            setLoading(false)
            setSavedMessage(newCategory + " saved")
        }
    }

    return (
        <div className="flex">
            <SidePanel />
            <div className={` ${loading ? ' opacity-30 ' : ''} relative flex-[2] flex items-center justify-center`}>
                <div className="flex flex-col items-center justify-center gap-3">
                    <h1 className="font-bold text-[1.3rem]  text-gray-800">Generate part number</h1>

                    <Autocomplete
                        options={projects}
                        disablePortal
                        id="combo-box-demo"
                        value={project}
                        onChange={(e, val) => setProject(val)}
                        sx={{ width: 300, bgcolor: 'white' }}
                        renderInput={(params) => <TextField {...params} label='Choose project' />}
                    />

                    <Autocomplete
                        options={categories}
                        disablePortal
                        id="combo-box-demo"
                        value={category}
                        onChange={(e, val) => setCategory(val)}
                        sx={{ width: 300, bgcolor: 'white' }}
                        renderInput={(params) => <TextField {...params} label='Choose assembly category' />}
                    />
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add part number description" className="border border-gray-400 rounded-md py-4 px-3 w-full  outline-none resize-none" />
                    <button onClick={handleGenerate} id="generate-btn" type="button" className="bg-green-700 hover:bg-green-600 px-3 w-fit mx-auto py-1 rounded-md text-white">Generate Part number</button>

                </div>
                <div className="absolute top-7 left-2 flex flex-col gap-3">

                    <Link href='/view-data'><button className=" bg-slate-700 text-white px-5 py-3 rounded-lg hover:bg-slate-600">View Data</button></Link>
                    <button onClick={() => { setAddProjectWindow(true) }} className="   bg-slate-700 text-white px-5 py-3 rounded-lg  hover:bg-slate-600">Add new project</button>
                    <button onClick={() => { setAddCategoryWindow(true) }} className="   bg-slate-700 text-white px-5 py-3 rounded-lg  hover:bg-slate-600">Add new category</button>
                </div>


                {addProjectWindow &&
                    <div className="absolute border border-gray-400 bg-white shadow-lg flex flex-col z-20 p-3 h-[210px] w-[370px] rounded-lg">
                        <button onClick={() => { setAddProjectWindow(false); setSavedMessage(null); fetchProductionProjects(); }} className="absolute right-2 top-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm2.78-4.22a.75.75 0 0 1-1.06 0L8 9.06l-1.72 1.72a.75.75 0 1 1-1.06-1.06L6.94 8 5.22 6.28a.75.75 0 0 1 1.06-1.06L8 6.94l1.72-1.72a.75.75 0 1 1 1.06 1.06L9.06 8l1.72 1.72a.75.75 0 0 1 0 1.06Z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <h1 className="font-bold text-center">Add Project</h1>
                        <div className="flex flex-col items-center mt-6 gap-4">
                            <form action={handleAddProject} className="flex flex-col items-center">
                                <input value={newProject} onChange={(e) => setNewProject(e.target.value)} placeholder="Enter project" name="project" className="border p-2 w-[90%] rounded-md" />
                                <button onClick={() => setLoading(true)} type='submit' className="border bg-green-700 text-white  mt-2 px-3 py-1 rounded-md">Save</button>
                            </form>

                            {savedMessage &&
                                <div>
                                    {savedMessage}
                                </div>
                            }
                        </div>
                    </div>
                }

                {addCategoryWindow &&
                    <div className="absolute border border-gray-400 bg-white shadow-lg flex flex-col items-center justify-center z-20 p-3 h-[210px] w-[370px] rounded-lg">
                        <button onClick={() => { setAddCategoryWindow(false); setSavedMessage(null); fetchProductionCategories(); }} className="absolute top-2 right-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm2.78-4.22a.75.75 0 0 1-1.06 0L8 9.06l-1.72 1.72a.75.75 0 1 1-1.06-1.06L6.94 8 5.22 6.28a.75.75 0 0 1 1.06-1.06L8 6.94l1.72-1.72a.75.75 0 1 1 1.06 1.06L9.06 8l1.72 1.72a.75.75 0 0 1 0 1.06Z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <h1 className="font-bold text-center">Add Assembly Category</h1>
                        <div className="flex flex-col items-center mt-6 gap-4">
                            <form action={handleAddCategory} className="flex flex-col items-center">
                                <input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Enter category" name="category" className="border p-2 w-[90%] rounded-md" />
                                <button onClick={() => setLoading(true)} type='submit' className="border bg-green-700 text-white mt-2  px-3 py-1 rounded-md">Save</button>
                            </form>
                            {savedMessage &&
                                <div>
                                    {savedMessage}
                                </div>
                            }
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


                {loading && <div className=" z-50"><SpinningLoader /></div>}
            </div>
        </div>
    )
}