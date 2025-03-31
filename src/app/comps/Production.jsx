"use client"
import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { addProductionCategory, addProductionProject, saveProductionPN } from "@/lib/actions";
import axios from "axios";
import { generateChecksum } from "@/utils/help";
import { AnimatePresence, motion } from "framer-motion";
import SpinningLoader from "../_components/SpinningLoader";

export default function ProductionComp() {
    const [project, setProject] = useState('');
    const [category, setCategory] = useState('');
    const [projects, setProjects] = useState([]);
    const [categories, setCategories] = useState([]);
    const [description, setDescription] = useState('');
    const [unit, setUnit] = useState('');
    const [addProjectWindow, setAddProjectWindow] = useState(false);
    const [newProject, setNewProject] = useState('');
    const [addCategoryWindow, setAddCategoryWindow] = useState(false);
    const [projectData, setProjectData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [existString, setExistString] = useState('');
    const [existMessage, setExistMessage] = useState(false);
    const [savedMessage, setSavedMessage] = useState(null);
    const [newCategory, setNewCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [confirmationWindow, setConfirmationWindow] = useState(false);

    const confirmButton = useRef(null);

    const fetchProductionProjects = async () => {
        try {
            const res = await axios.get('/api/production/fetchProjects');
            if (res.data) {
                setProjectData(res.data);
                const names = res.data.map(item => item.name);
                setProjects(names);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const fetchProductionCategories = async (selectedProject) => {
        try {
            const res = await axios.get('/api/production/fetchCategory', {
                params: { project: selectedProject }
            });
            if (res.data) {
                setCategoryData(res.data);
                const names = res.data.map(item => item.category);
                setCategories(names);
            } else {
                setCategories([]); // No categories for this project yet
                setCategoryData([]);
            }
        } catch (err) {
            console.log(err);
            setCategories([]);
            setCategoryData([]);
        }
    }

    function fetchCategoryNumber() {
        const catNum = categoryData.find(item => item.category === category)?.categoryNumber;
        return catNum ? String(catNum).padStart(2, '0') : '01';
    }

    function fetchProjectNumber() {
        const projectNum = projectData.find(item => item.name === project)?.projectNumber;
        return projectNum ? String(projectNum).padStart(2, '0') : '01';
    }

    async function fetchPartNumber() {
        var data = null;
        try {
            const res = await axios.get('/api/production/fetchPartnumber/', {
                params: { project, category }
            });
            if (res.data) {
                data = res.data.partialPartNumber;
            }
        } catch (err) {
            console.log(err);
        }
        return data;
    }

    function incrementPN(partialPN) {
        var partStr = String(partialPN)
        var lastDigits = partStr.slice(-3) // Extract last 3 digits
        var incrementedDigits = parseInt(lastDigits, 10) + 1;
        incrementedDigits = ("000" + incrementedDigits).slice(-3); // Ensure 3 digits
        var newPartNumber = String(partStr.slice(0, -3) + incrementedDigits);
        return newPartNumber
    }

    const savePN = async (partialPN, newPN) => {
        const newdoc = {
            category: category,
            project: project,
            description: description,
            unit: unit,
            partialPartNumber: Number(partialPN),
            partNumber: newPN
        };
        console.log(newdoc);
        setConfirmationWindow(false);
        await saveProductionPN(newdoc); // Save to backend
        setExistMessage(true);
        setExistString("Part number generated:- " + newPN);
        setLoading(false);
        // Clear description and unit fields after saving
        setDescription('');
        setUnit('');
    }

    function confirmSave() {
        confirmButton.current.disabled = true;
        confirmButton.current.style.backgroundColor = 'gray';
        handleGenerate();
    }

    const handleGenerate = async () => {
        // Validation: Ensure project and category are selected
        if (!project || !category) {
            setExistMessage(true);
            setExistString("Please select both a project and an assembly category.");
            setLoading(false); // Ensure loading stops if it was triggered
            return;
        }

        setLoading(true);
        var newPartNumber;
        var categoryNumber = fetchCategoryNumber();
        var projectNumber = fetchProjectNumber();
        var existingPN = await fetchPartNumber();

        console.log(categoryNumber, projectNumber, existingPN);
        if (!existingPN) {
            newPartNumber = `3${projectNumber}${categoryNumber}001`;
        } else {
            newPartNumber = incrementPN(existingPN);
        }
        var npn = generateChecksum(newPartNumber);
        savePN(newPartNumber, npn);
    }

    useEffect(() => {
        fetchProductionProjects();
    }, []);

    useEffect(() => {
        if (project) {
            setCategory(''); // Reset category when project changes
            fetchProductionCategories(project);
        } else {
            setCategories([]); // Clear categories if no project is selected
            setCategory('');
        }
    }, [project]);

    const handleAddProject = async (e) => {
        if (!newProject) {
            setSavedMessage('Please enter project');
        } else {
            setLoading(true);
            await addProductionProject(e);
            setLoading(false);
            setSavedMessage(newProject + " saved");
            fetchProductionProjects(); // Refresh projects
            setAddProjectWindow(false);
            setNewProject('');
        }
    }

    const handleAddCategory = async (e) => {
        if (!newCategory) {
            setSavedMessage('Please enter category');
        } else if (!project) {
            setSavedMessage('Please select a project first');
        } else {
            setLoading(true);
            const formData = new FormData();
            formData.append('category', newCategory);
            formData.append('project', project); // Pass the selected project
            await addProductionCategory(formData);
            setLoading(false);
            setSavedMessage(newCategory + " saved");
            fetchProductionCategories(project); // Refresh categories for this project
            setAddCategoryWindow(false);
            setNewCategory('');
        }
    }

    return (
        <div className={` ${loading ? ' opacity-30 ' : ''} relative flex-[2] flex flex-col items-center justify-center`}>
            <h1 className="text-[2rem] text-center uppercase text-slate-800 my-10 font-bold">Part number generation for Production</h1>

            <div className="flex-[1] flex justify-between absolute items-center px-5 w-full">
                <div className="flex flex-col gap-3">
                    <button 
                        onClick={() => { setAddProjectWindow(true); }} 
                        className="bg-slate-700 text-white px-5 py-3 rounded-lg hover:bg-slate-600"
                    >
                        Add new project
                    </button>
                    <button 
                        onClick={() => { setAddCategoryWindow(true); }} 
                        disabled={!project} 
                        className={`bg-slate-700 text-white px-5 py-3 rounded-lg ${!project ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-600'}`}
                    >
                        Add new category
                    </button>
                </div>
            </div>
            <div className="flex flex-col flex-[2] gap-3">
                <h1 className="font-bold text-[1.3rem] text-gray-800">Generate part number</h1>

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
                <textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Add part number description" 
                    className="border border-gray-400 rounded-md py-4 px-3 w-full outline-none resize-none" 
                />
                <textarea 
                    value={unit} 
                    onChange={(e) => setUnit(e.target.value)} 
                    placeholder="Add UoM" 
                    className="border border-gray-400 rounded-md py-4 px-3 w-full outline-none resize-none" 
                />

                <button 
                    onClick={() => setConfirmationWindow(true)} 
                    id="generate-btn" 
                    type="button" 
                    disabled={!project || !category} // Disable if either is missing
                    className={`bg-green-700 px-3 w-fit mx-auto py-1 rounded-md text-white ${(!project || !category) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}`}
                >
                    Generate Part number
                </button>
            </div>

            {addProjectWindow &&
                <div className="absolute h-full w-full flex items-center justify-center bg-white bg-opacity-90">
                    <div className="border relative border-gray-400 bg-white shadow-lg flex flex-col z-20 p-3 h-[210px] w-[370px] rounded-lg">
                        <button onClick={() => { setAddProjectWindow(false); setSavedMessage(null); fetchProductionProjects(); }} className="absolute right-2 top-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm2.78-4.22a.75.75 0 0 1-1.06 0L8 9.06l-1.72 1.72a.75.75 0 1 1-1.06-1.06L6.94 8 5.22 6.28a.75.75 0 0 1 1.06-1.06L8 6.94l1.72-1.72a.75.75 0 1 1 1.06 1.06L9.06 8l1.72 1.72a.75.75 0 0 1 0 1.06Z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <h1 className="font-bold text-center">Add Project</h1>
                        <div className="flex flex-col items-center w-full mt-6 gap-4">
                            <form action={handleAddProject} className="flex w-[80%] flex-col items-center">
                                <input value={newProject} onChange={(e) => setNewProject(e.target.value)} placeholder="Enter project" name="project" className="border p-2 w-full rounded-md" />
                                <button onClick={() => setLoading(true)} type='submit' className="border bg-green-700 text-white mt-2 px-3 py-1 rounded-md">Save</button>
                            </form>
                            {savedMessage &&
                                <div>
                                    {savedMessage}
                                </div>
                            }
                        </div>
                    </div>
                </div>
            }

            {addCategoryWindow &&
                <div className="absolute h-full w-full flex items-center justify-center bg-white bg-opacity-90">
                    <div className="relative border border-gray-400 bg-white shadow-lg flex flex-col items-center justify-center z-20 p-3 h-[210px] w-[370px] rounded-lg">
                        <button onClick={() => { setAddCategoryWindow(false); setSavedMessage(null); fetchProductionCategories(); }} className="absolute top-2 right-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm2.78-4.22a.75.75 0 0 1-1.06 0L8 9.06l-1.72 1.72a.75.75 0 1 1-1.06-1.06L6.94 8 5.22 6.28a.75.75 0 0 1 1.06-1.06L8 6.94l1.72-1.72a.75.75 0 1 1 1.06 1.06L9.06 8l1.72 1.72a.75.75 0 0 1 0 1.06Z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <h1 className="font-bold text-center">Add Assembly Category</h1>
                        <div className="flex flex-col items-center mt-6 gap-4">
                            <form action={handleAddCategory} className="flex flex-col items-center">
                                <input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Enter category" name="category" className="border p-2 w-[90%] rounded-md" />
                                <button onClick={() => setLoading(true)} type='submit' className="border bg-green-700 text-white mt-2 px-3 py-1 rounded-md">Save</button>
                            </form>
                            {savedMessage &&
                                <div>
                                    {savedMessage}
                                </div>
                            }
                        </div>
                    </div>
                </div>
            }

            <AnimatePresence>
                {existMessage &&
                    <motion.div initial={{ y: -500 }} animate={{ y: 0 }} exit={{ y: -500 }} className="absolute -top-4 py-[10px] px-[15px] bg-slate-600 text-white flex items-center justify-center gap-3 rounded-md shadow-sm shadow-black">
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
                {confirmationWindow &&
                    <motion.div
                        className="absolute z-40 rounded-md h-[100%] w-[100%] bg-white bg-opacity-90 flex flex-col items-center justify-center p-2 text-[0.9rem]">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="flex flex-col bg-white rounded-lg border p-4 shadow-lg w-[400px]">
                            <h1 className="text-[1.2rem] font-bold mb-3">Confirmation</h1>
                            <p>Verify the data before saving.</p>
                            <div className="w-full flex flex-col py-3">
                                <div className="border-t-2 p-2 w-full">Project: <span className="font-medium">{project}</span></div>
                                <div className="p-2 w-full">Assembly Category: <span className="font-medium">{category}</span></div>
                                <div className="p-2 w-full">Description: <span className="font-medium">{description}</span></div>
                            </div>
                            <div>
                                <button onClick={() => setConfirmationWindow(false)} className="border border-green-700 text-black mr-6 px-3 py-1 rounded-md">Back</button>
                                <button ref={confirmButton} onClick={confirmSave} className="border bg-green-700 text-white px-3 py-1 rounded-md">Confirm and Save</button>
                            </div>
                        </motion.div>
                    </motion.div>
                }
            </AnimatePresence>

            {loading && <div className="z-50"><SpinningLoader /></div>}
        </div>
    )
}
