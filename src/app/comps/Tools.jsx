"use client";
import { Autocomplete, TextField } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import CreateCategory from "../_components/CreateCategory";
import axios from "axios";
import { generateChecksum } from "@/utils/help";
import SpinningLoader from "../_components/SpinningLoader";
import ToolsCategory from "../_components/ToolsCreateCat";

export default function Tools({ broadCategory = "Tools and Equipments" }) {
    const router = useRouter();
    const [mpn, setMpn] = useState("");
    const [make, setMake] = useState("");
    const [existString, setExistString] = useState("");
    const [existMessage, setExistMessage] = useState(false);
    const [data, setData] = useState(null);
    const [catWindowVisible, setCatWindowVisible] = useState(false);

    const [subcategories, setSubcategories] = useState([]);
    const [makes, setMakes] = useState([]);
    const [choosenCategory, setChoosenCategory] = useState("");
    const [choosenCapital, setChoosenCapital] = useState("");
    const [choosenSubcategory, setChoosenSubcategory] = useState("");

    const [loggedIn, setLoggedIn] = useState(false);
    const [description, setDescription] = useState("");
    const [unit, setUnit] = useState("");

    const [dataSaving, setDataSaving] = useState(false);
    const [addMakeWindow, setAddMakeWindow] = useState(false);
    const [addCapitalWindow, setAddCapitalWindow] = useState(false);
    const [blurBackground, setBlurBackground] = useState(false);
    const [newMake, setNewMake] = useState("");
    const [newCapital, setNewCapital] = useState("");
    const [capitalData, setCapitalData] = useState([]);

    const [makeAddMessage, setMakeAddMessage] = useState(null);
    const [broadCategories, setBroadCategories] = useState([]);
    const [broadCategorynames, setBroadCategorynames] = useState([]);

    const [consumableWindow, setConsumableWindow] = useState(false);
    const [categories, setCategories] = useState([]);
    const [capitals, setCapitals] = useState([]);
    const [confirmationWindow, setConfirmationWindow] = useState(false);
    const [generateWindowShow, SetGenerateWindowShow] = useState(false);

    const [capitalNumber, setCapitalNumber] = useState("");
    const [capitalCategoryData, setCapitalCategoryData] = useState([]);

    const confirmButton = useRef(null);

    const handleCategoryChange = (e, val) => {
        setChoosenCategory(val);
        if (val === "Other") {
            setCatWindowVisible(true);
            setBlurBackground(true);
        }
    };

    const handleCapitalChange = (e, val) => {
        setChoosenCapital(val);
        setChoosenCategory("");
        setChoosenSubcategory("");
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (mpn && make) {
            setDataSaving(true);
            const data = await checkMpnMake();
            if (data != null) {
                setData(data);
                setDataSaving(false);
                setExistString("MPN and MAKE already exists. Part number: " + data.partNumber);
                setExistMessage(true);
            } else {
                setDataSaving(false);
                setExistString("MPN and MAKE does not exists. You may enter category and subcategory to proceed");
                setExistMessage(true);
            }
        } else {
            setExistMessage(true);
            setExistString("You have not entered both MPN and Make");
        }
    };

    const fetchCapitals = async () => {
        try {
            const res = await axios.get("/api/fetchCapital/");
            console.log(res.data);
            if (res.data) {
                const allData = res.data;
                setCapitalCategoryData(allData);
                const uniqueCapital = [...new Set(allData.map((item) => item.capital))];
                console.log(uniqueCapital);
                setCapitals([...uniqueCapital]);
                setCapitalData(res.data);
            }
        } catch (error) {
            console.error("Error fetching capitals", error);
        }
    };

    let confirmSaveFlag = false;

    function confirmSave() {
        confirmSaveFlag = true;
        confirmButton.current.disabled = true;
        confirmButton.current.style.backgroundColor = "gray";
        handleGenerate();
    }

    const fetchSubcatDigits = async (categoryToFind, subcategoryToFind) => {
        try {
            // Fetch categories for the specific capital
            const res = await axios.get("/api/category", {
                params: { broadCategory: "Tools and Equipments", capital: choosenCapital },
            });
            const data = res.data || [];
            console.log("Fetched categories for", choosenCapital, ":", data);

            // Filter categories to the current capital
            const existingCats = data.filter((cat) => cat.capital === choosenCapital);
            console.log("Existing categories:", existingCats);

            // Check if the category already exists under this capital
            const catMatch = existingCats.find((cat) => cat.category === categoryToFind);

            let newCatNum, newSubcatNum;

            if (catMatch) {
                // Category exists, check subcategory
                const subcatMatch = existingCats.find(
                    (cat) => cat.category === categoryToFind && cat.subcategory === subcategoryToFind
                );
                if (subcatMatch) {
                    newCatNum = subcatMatch.categoryNumber.toString().padStart(2, "0");
                    newSubcatNum = subcatMatch.subcatNumber.toString().padStart(2, "0");
                } else {
                    // New subcategory under existing category
                    const existingSubcats = existingCats.filter((cat) => cat.category === categoryToFind);
                    const maxSubcatNum =
                        existingSubcats.length > 0
                            ? Math.max(...existingSubcats.map((cat) => parseInt(cat.subcatNumber)))
                            : 0;
                    newCatNum = catMatch.categoryNumber.toString().padStart(2, "0");
                    newSubcatNum = (maxSubcatNum + 1).toString().padStart(2, "0");

                    await axios.post("/api/category", {
                        capital: choosenCapital,
                        category: categoryToFind,
                        subcategory: subcategoryToFind,
                        categoryNumber: newCatNum,
                        subcatNumber: newSubcatNum,
                        broadCategory: "Tools and Equipments",
                    });
                }
            } else {
                // New category under this capital
                const maxCatNum =
                    existingCats.length > 0
                        ? Math.max(...existingCats.map((cat) => parseInt(cat.categoryNumber)))
                        : 0;
                newCatNum = (maxCatNum + 1).toString().padStart(2, "0");
                newSubcatNum = "01";

                await axios.post("/api/category", {
                    capital: choosenCapital,
                    category: categoryToFind,
                    subcategory: subcategoryToFind,
                    categoryNumber: newCatNum,
                    subcatNumber: newSubcatNum,
                    broadCategory: "Tools and Equipments",
                });
            }

            console.log(`Returning categoryNumber: ${newCatNum}, subcategoryNumber: ${newSubcatNum}`);
            return { categoryNumber: newCatNum, subcategoryNumber: newSubcatNum };
        } catch (err) {
            console.error("Error in fetchSubcatDigits:", err);
            return { categoryNumber: "01", subcategoryNumber: "01" };
        }
    };

    const checkMpnMake = async () => {
        try {
            const res = await axios.get("/api/mpn/", {
                params: { mpn, make, broadCategory: "Tools and Equipments" },
            });
            console.log(res.data);
            if (!res.data) {
                SetGenerateWindowShow(true);
            }
            return res.data;
        } catch (err) {
            console.log(err);
        }
    };

    const fetchCapitalNumber = () => {
        const found = capitalData.find((obj) => obj["capital"] === choosenCapital);
        console.log(found);
        return found ? found.capitalNumber : null;
    };

    const handleGenerate = async () => {
        if (mpn && make && choosenCategory && choosenSubcategory && choosenCapital) {
            const data = await checkMpnMake();
            console.log(data);
            if (data) {
                setConfirmationWindow(false);
                setExistString("MPN and MAKE already exists. Part number: " + data.partNumber);
                setExistMessage(true);
            } else {
                if (confirmSaveFlag) {
                    if (choosenCategory && choosenSubcategory && description) {
                        setDataSaving(true);
                        try {
                            const { categoryNumber, subcategoryNumber } = await fetchSubcatDigits(
                                choosenCategory,
                                choosenSubcategory
                            );
                            console.log(
                                `handleGenerate: categoryNumber=${categoryNumber}, subcategoryNumber=${subcategoryNumber}`
                            );
                            const res = await axios.get("/api/mpn/", {
                                params: {
                                    choosenCategory,
                                    choosenSubcategory,
                                    broadCategory: "Tools and Equipments",
                                    choosenCapital,
                                },
                                cache: "no-store",
                            });
                            console.log(res.data);
                            if (res.data == null) {
                                saveNewPN(0, categoryNumber, subcategoryNumber);
                            } else {
                                generateNewPN(res.data.partNumber, categoryNumber, subcategoryNumber);
                            }
                        } catch (err) {
                            console.log(err);
                        } finally {
                            setDataSaving(false);
                        }
                    } else {
                        setExistMessage(true);
                        setExistString("Enter all the values to proceed");
                    }
                }
            }
        } else {
            setExistMessage(true);
            setExistString("Enter all the values to proceed");
        }
    };

    const saveNewPN = async (number, categoryNumber, subcategoryNumber) => {
        let newPartNumber;
        let capitalNumber = fetchCapitalNumber();
        if (number === 0) {
            const catNum = categoryNumber.toString().padStart(2, "0");
            const subcatNum = subcategoryNumber.toString().padStart(2, "0");
            newPartNumber = `6${capitalNumber}${catNum}${subcatNum}01`;
        } else {
            newPartNumber = number.toString().slice(0, 8); // 8-digit partial
        }
        var npn = generateChecksum(newPartNumber); // Always recalculate checksum
    
        const updated = {
            mpn: mpn,
            make: make,
            caprev: choosenCapital,
            category: choosenCategory,
            subcategory: choosenSubcategory,
            description: description,
            unit: unit,
            partialPartNumber: Number(newPartNumber),
            partNumber: npn,
            broadCategory: broadCategory,
        };
    
        const res = await axios.post("/api/mpn/", updated);
        if (res.status === 200) {
            setConfirmationWindow(false);
            setExistMessage(true);
            setExistString("New part number generated: " + npn);
        }
    };

    const generateNewPN = (number, categoryNumber, subcategoryNumber) => {
        console.log(number);
        let capitalNumber = fetchCapitalNumber();
        let currentPrefix = `6${capitalNumber}${categoryNumber.toString().padStart(2, "0")}${subcategoryNumber.toString().padStart(2, "0")}`;

        if (number.toString().startsWith(currentPrefix)) {
            var partStr = String(number).slice(0, 8);
            var lastDigits = partStr.slice(-2);
            if (lastDigits === "99") {
                setExistString("Cannot generate new part number as maximum limit has reached");
                setExistMessage(true);
            } else {
                var incrementedDigits = parseInt(lastDigits, 10) + 1;
                incrementedDigits = ("00" + incrementedDigits).slice(-2);
                var newPartNumber = String(partStr.slice(0, -2) + incrementedDigits);
                var npn = generateChecksum(newPartNumber);
                console.log("New Part Number:- ", npn);
                saveNewPN(npn, categoryNumber, subcategoryNumber);
            }
        } else {
            var newPartNumber = `${currentPrefix}01`;
            var npn = generateChecksum(newPartNumber);
            console.log("New Part Number (Reset):- ", npn);
            saveNewPN(npn, categoryNumber, subcategoryNumber);
        }
    };

    const handleCapitalSave = async () => {
        setDataSaving(true);
        const res = await axios.post("/api/newCapital", { capitalName: newCapital, capitalNumber: capitalNumber });
        console.log(res);
        if (res.status === 200) {
            setDataSaving(false);
            setMakeAddMessage(newCapital);
            fetchCapitals();
        }
    };

    const handleMakeSave = async () => {
        setDataSaving(true);
        const res = await axios.post("/api/newMake", { make: newMake, broadCategory: broadCategory });
        console.log(res);
        if (res.status === 200) {
            setDataSaving(false);
            setMakeAddMessage(res.data.make);
            fetchMake();
        }
    };

    const fetchMake = async () => {
        try {
            const res = await axios.get("/api/fetchMakes", {
                params: { broadCategory: "Tools and Equipments" },
            });
            console.log(res.data);
            const allmakes = res.data;
            const names = [...new Set(allmakes.map((item) => item.name).filter((name) => name))];
            console.log(names);
            setMakes(names);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const fetchSubcat = async () => {
            const res = await axios.get("/api/fetchCategories/", {
                params: { broadCategory: "Tools and Equipments", capital: choosenCapital },
            });
            console.log(res.data);
            if (res.data) {
                const allData = res.data;
                const filteredSubCategories = Array.from(
                    new Set(
                        allData
                            .filter((item) => item.category === choosenCategory && item.capital === choosenCapital)
                            .map((item) => item.subcategory)
                    )
                );
                console.log(filteredSubCategories);
                setSubcategories(filteredSubCategories);
            }
        };
        if (choosenCategory && choosenCapital) {
            fetchSubcat();
        }
        setChoosenSubcategory("");
    }, [choosenCategory, choosenCapital]);

    useEffect(() => {
        if (choosenCapital) {
            const fetchcat = async () => {
                const res = await axios.get("/api/fetchCategories/", {
                    params: { broadCategory: "Tools and Equipments", capital: choosenCapital },
                });
                console.log(res.data);
                if (res.data) {
                    const allData = res.data;
                    const filteredCategories = Array.from(
                        new Set(allData.filter((item) => item.capital === choosenCapital).map((item) => item.category))
                    );
                    console.log(filteredCategories);
                    setCategories([...filteredCategories, "Other"]);
                }
            };
            fetchcat();
        }
        setChoosenCategory("");
    }, [choosenCapital]);

    const updateData = () => {
        const fetchcat = async () => {
            const res = await axios.get("/api/fetchCategories/", {
                params: { broadCategory: "Tools and Equipments", capital: choosenCapital },
            });
            console.log(res.data);
            if (res.data) {
                const allData = res.data;
                const filteredCategories = Array.from(
                    new Set(allData.filter((item) => item.capital === choosenCapital).map((item) => item.category))
                );
                console.log(filteredCategories);
                setCategories([...filteredCategories, "Other"]);
            }
        };
        fetchcat();
    };

    useEffect(() => {
        fetchCapitals();
        fetchMake();
    }, []);

    return (
        <div
            className={
                dataSaving === true
                    ? `flex items-center justify-center opacity-[0.5] w-full relative flex-col`
                    : `flex flex-col items-center w-full relative justify-center opacity-1 `
            }
        >
            <h1 className="text-[4vh] text-center uppercase text-slate-800 my-10 font-bold">
                Part number generation for Tools and Equipment
            </h1>

            <div className={`flex ${blurBackground ? " brightness-50 blur" : ""} max-sm:flex-col items-center text-black justify-center w-full h-full  `}>
                <div className="flex gap-10 flex-col h-full w-full items-center justify-center relative ">
                    <button
                        onClick={() => {
                            setAddMakeWindow(true);
                            setBlurBackground(true);
                            setMakeAddMessage("");
                        }}
                        className=" absolute bottom-0 left-3 mx-4 bg-slate-700 text-white px-5 py-3 rounded-lg hover:bg-slate-600"
                    >
                        Add new Make
                    </button>
                    <button
                        onClick={() => {
                            setAddCapitalWindow(true);
                            setBlurBackground(true);
                            setMakeAddMessage("");
                        }}
                        className=" absolute bottom-20 left-3 mx-4 bg-slate-700 text-white px-5 py-3 rounded-lg hover:bg-slate-600"
                    >
                        Add new capital/revenue
                    </button>

                    <div className="flex max-sm:flex-col items-baseline gap-14 mt-6">
                        <form className="flex flex-col gap-4 items-center justify-center " onSubmit={handleSearch}>
                            <h1 className="font-bold text-[1.1rem] text-gray-800">Search MPN and Make</h1>
                            <div className="flex flex-col gap-3">
                                <input
                                    className="border border-gray-400 outline-none py-4 px-3 rounded-md w-[300px]"
                                    onChange={(e) => setMpn(e.target.value)}
                                    value={mpn}
                                    placeholder="Enter MPN"
                                    type="text"
                                    id="mpn"
                                    name="mpn"
                                />
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    value={make}
                                    onChange={(e, val) => setMake(val)}
                                    options={makes}
                                    sx={{ bgcolor: "white", fontFamily: "monospace" }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            inputProps={{ ...params.inputProps, style: { fontSize: 14 } }}
                                            label="Choose Make"
                                        />
                                    )}
                                />
                            </div>
                            <div className="flex flex-col gap-4 justify-center items-center">
                                <button className="bg-green-700 px-5 w-[fit-content] rounded-md py-1 text-white hover:bg-green-600" type="submit">
                                    Search
                                </button>
                            </div>
                        </form>
                        <AnimatePresence>
                            {generateWindowShow && (
                                <motion.div
                                    initial={{ x: 800, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ type: "just" }}
                                    className="flex flex-col gap-4"
                                >
                                    <h1 className="font-bold text-[1.1rem] text-gray-800">Generate part number</h1>
                                    <div className="flex flex-col gap-2 items-center justify-center">
                                        <div className="flex flex-col">
                                            <Autocomplete
                                                disablePortal
                                                id="combo-box-demo"
                                                value={choosenCapital}
                                                onChange={handleCapitalChange}
                                                options={capitals}
                                                sx={{ bgcolor: "white", width: 300 }}
                                                renderInput={(params) => <TextField {...params} label="Choose Capital/Revenue" />}
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <Autocomplete
                                                disablePortal
                                                id="combo-box-demo"
                                                value={choosenCategory}
                                                onChange={handleCategoryChange}
                                                options={categories}
                                                sx={{ bgcolor: "white", width: 300 }}
                                                renderInput={(params) => <TextField {...params} label="Choose category" />}
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <Autocomplete
                                                disablePortal
                                                id="combo-box-demo"
                                                value={choosenSubcategory}
                                                onChange={(e, val) => setChoosenSubcategory(val)}
                                                options={subcategories}
                                                sx={{ width: 300, bgcolor: "white" }}
                                                renderInput={(params) => <TextField {...params} label="Choose subcategory" />}
                                            />
                                        </div>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Add part number description"
                                            className="border border-gray-400 rounded-md py-4 px-3 w-full outline-none resize-none"
                                        />
                                        <textarea
                                            value={unit}
                                            onChange={(e) => setUnit(e.target.value)}
                                            rows={1}
                                            placeholder="Add UoM"
                                            className="border border-gray-400 rounded-md py-4 px-3 w-full outline-none resize-none"
                                        />
                                    </div>
                                    <button
                                        onClick={() => setConfirmationWindow(true)}
                                        id="generate-btn"
                                        type="button"
                                        className="bg-green-700 hover:bg-green-600 px-3 w-fit mx-auto py-1 rounded-md text-white"
                                    >
                                        Generate Part number
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <AnimatePresence>
                        {confirmationWindow && (
                            <motion.div className="absolute z-40 rounded-md h-[100%] w-[100%] bg-white bg-opacity-90 flex flex-col items-center justify-center p-2 text-[0.9rem]">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    className="flex flex-col bg-white rounded-lg border p-4 shadow-lg w-[400px]"
                                >
                                    <h1 className="text-[1.2rem] font-bold mb-3">Confirmation</h1>
                                    <p>Verify the data before saving.</p>
                                    <div className="w-full flex flex-col py-3">
                                        <div className="border-t-2 p-2 w-full">
                                            MPN: <span className="font-medium">{mpn}</span>
                                        </div>
                                        <div className="p-2 w-full">
                                            Make: <span className="font-medium">{make}</span>
                                        </div>
                                        <div className="p-2 w-full">
                                            Capital: <span className="font-medium">{choosenCapital}</span>
                                        </div>
                                        <div className="p-2 w-full">
                                            Category: <span className="font-medium">{choosenCategory}</span>
                                        </div>
                                        <div className="p-2 w-full">
                                            Subcategory: <span className="font-medium">{choosenSubcategory}</span>
                                        </div>
                                        <div className="p-2 w-full">
                                            Description: <span className="font-medium">{description}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => setConfirmationWindow(false)}
                                            className="border border-green-700 text-black mr-6 px-3 py-1 rounded-md"
                                        >
                                            Back
                                        </button>
                                        <button
                                            ref={confirmButton}
                                            onClick={confirmSave}
                                            className="border bg-green-700 text-white px-3 py-1 rounded-md"
                                        >
                                            Confirm and Save
                                        </button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <AnimatePresence>
                {addMakeWindow && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="absolute border border-gray-400 bg-white shadow-lg flex flex-col z-20 p-3 h-[210px] w-[370px] rounded-lg"
                    >
                        <button
                            onClick={() => {
                                setAddMakeWindow(false);
                                setBlurBackground(false);
                            }}
                            className="absolute right-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="w-4 h-4"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm2.78-4.22a.75.75 0 0 1-1.06 0L8 9.06l-1.72 1.72a.75.75 0 1 1-1.06-1.06L6.94 8 5.22 6.28a.75.75 0 0 1 1.06-1.06L8 6.94l1.72-1.72a.75.75 0 1 1 1.06 1.06L9.06 8l1.72 1.72a.75.75 0 0 1 0 1.06Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                        <h1 className="font-bold text-center">Add make</h1>
                        <div className="flex flex-col items-center mt-6 gap-4">
                            <input
                                value={newMake}
                                onChange={(e) => setNewMake(e.target.value)}
                                placeholder="Enter make"
                                name="make"
                                className="border p-2 w-[90%] rounded-md"
                            />
                            <button onClick={handleMakeSave} className="border bg-green-700 text-white px-3 py-1 rounded-md">
                                Save
                            </button>
                            {makeAddMessage && <div className="text-green-800">{makeAddMessage} saved</div>}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {addCapitalWindow && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="absolute border border-gray-400 bg-white shadow-lg flex flex-col z-20 p-3 min-h-[210px] max-h-auto w-[370px] rounded-lg"
                    >
                        <button
                            onClick={() => {
                                setAddCapitalWindow(false);
                                setBlurBackground(false);
                            }}
                            className="absolute right-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="w-4 h-4"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm2.78-4.22a.75.75 0 0 1-1.06 0L8 9.06l-1.72 1.72a.75.75 0 1 1-1.06-1.06L6.94 8 5.22 6.28a.75.75 0 0 1 1.06-1.06L8 6.94l1.72-1.72a.75.75 0 1 1 1.06 1.06L9.06 8l1.72 1.72a.75.75 0 0 1 0 1.06Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                        <h1 className="font-bold text-center">Add Capital/Revenue</h1>
                        <div className="flex flex-col items-center mt-6 gap-4">
                            <input
                                value={capitalNumber}
                                onChange={(e) => setCapitalNumber(e.target.value)}
                                type="number"
                                className="border p-2 w-[90%] rounded-md"
                                placeholder="Enter capital/revenue number"
                            />
                            <input
                                value={newCapital}
                                onChange={(e) => setNewCapital(e.target.value)}
                                placeholder="Enter capital/revenue"
                                name="capital"
                                className="border p-2 w-[90%] rounded-md"
                            />
                            <button onClick={handleCapitalSave} className="border bg-green-700 text-white px-3 py-1 rounded-md">
                                Save
                            </button>
                            {makeAddMessage && <div className="text-green-800">{makeAddMessage} saved</div>}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {catWindowVisible && (
                    <ToolsCategory
                        setCatWindowVisible={setCatWindowVisible}
                        setBlurBackground={setBlurBackground}
                        broadCategory="Tools and Equipments"
                        onClose={updateData}
                        setLoader={setDataSaving}
                    />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {existMessage && (
                    <motion.div
                        initial={{ y: -500 }}
                        animate={{ y: 0 }}
                        exit={{ y: -500 }}
                        className="absolute -top-4 py-[10px] px-[15px] bg-slate-600 text-white flex items-center justify-center gap-3 rounded-md shadow-sm shadow-black"
                    >
                        <h1 className="">{existString}</h1>
                        <button onClick={() => setExistMessage(false)} className="">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="w-4 h-4"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm2.78-4.22a.75.75 0 0 1-1.06 0L8 9.06l-1.72 1.72a.75.75 0 1 1-1.06-1.06L6.94 8 5.22 6.28a.75.75 0 0 1 1.06-1.06L8 6.94l1.72-1.72a.75.75 0 1 1 1.06 1.06L9.06 8l1.72 1.72a.75.75 0 0 1 0 1.06Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {dataSaving && <SpinningLoader />}
        </div>
    );
}
