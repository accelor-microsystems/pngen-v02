"use client"
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CreateCategory from "./_components/CreateCategory";
import { Dropdown } from "primereact/dropdown";
import { Autocomplete, TextField } from "@mui/material";
import CategoryDropdown from "./_components/CategoryDropdown";
import Login from "./login/page";
import Cookies from "js-cookie";
import Link from "next/link";

export default function Home() {
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
  const [broadCategory, setBroadCategory] = useState('')


  var subcatDigits = 2;
  var categoryNumber = 0;
  var subcategoryNumber = 0;



  const handleSearch = async (e) => {
    e.preventDefault();
    if (mpn && make) {
      var data = await checkMpnMake();
      if (data != null) {

        // console.log(data)
        setData(data)

        setExistString('MPN and MAKE already exists. Part number: ' + data.partNumber)
        setExistMessage(true)
      }
      else {
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
        params: { mpn, make },
        cache: "no-store"
      });

      return res.data;

    }
    catch (err) {
      console.log(err)
    }

  }

  const fetchSubcatDigits = async (categoryToFind, subcategoryToFind) => {
    try {
      const res = await axios.get('/api/category/');
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


  const handleGenerate = async () => {
    var data = await checkMpnMake();
    if (data) {
      setExistString('MPN and MAKE already exists. Part number: ' + data.partNumber)
      setExistMessage(true)
    }
    else {


      if (choosenCategory && choosenSubcategory && description) {


        try {
          await fetchSubcatDigits(choosenCategory, choosenSubcategory)

          const res = await axios.get('/api/mpn/', {
            params: { choosenCategory, choosenSubcategory },
            cache: "no-store"
          });
          if (res.data == null) {
            // setExistMessage(true)
            // setExistString("Category and Subcategory does not exist")
            saveNewPN(0)
          }
          else {
            console.log(res.data)
            // setData(res.data)
            generateNewPN(res.data.partNumber);
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

      // for (let i = 0; i < newPartNumber.length; i++) {

      //   if (i % 2 === 0) {
      //     var n = String(newPartNumber[i] * 2)
      //     if(n.length > 1){
      //       var x = n[0] + n[1]
      //       console.log()
      //     }
      //     // evenDig.push(newPartNumber[i] * 2)
      //   }
      //   else {
      //     newPartNumber[i] * 3
      //     // oddDig.push(newPartNumber[i] * 3)
      //   }
      // }





      // else if (subcatDigits === 3) {
      //   var lastDigits = number.toString().slice(-2)

      //   var incrementedDigits = parseInt(lastDigits, 10) + 1;
      //   incrementedDigits = ("00" + incrementedDigits).slice(-2);

      //   var newPartNumber = parseInt(partStr.slice(0, -2) + incrementedDigits);

      // }
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
    // setData((prevData) => ({
    //   ...prevData,
    //   mpn: mpn,
    //   make: make,
    //   partNumber: number,
    // }));

    var newPartNumber;
    await fetchSubcatDigits();

    console.log(subcatDigits, categoryNumber, subcategoryNumber)

    if (number === 0) {
      newPartNumber = `10${categoryNumber}0${subcategoryNumber}001`
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
      mpn: mpn,
      make: make,
      category: choosenCategory,
      subcategory: choosenSubcategory,
      description: description,
      partialPartNumber: Number(newPartNumber),
      partNumber: npn
    }

    console.log(updated)

    const res = await axios.post('/api/mpn/', updated);
    if (res.status === 200) {
      setExistMessage(true)
      setExistString("New part number generated: " + npn)
    }

  }

  const openCategoryWindow = () => {
    setCatWindowVisible(true)
  }



  useEffect(() => {
    const fetchSubcat = async () => {
      const res = await axios.get('/api/category/')
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
    fetchSubcat();
  }, [choosenCategory])

  useEffect(() => {
    const fetchMake = async () => {
      const res = await axios.get('/api/addMake')
      const allmakes = res.data
      const names = allmakes.map((item) => item.name).filter(name => name);
      setMakes(names)
    }

    fetchMake();
  }, [])

  if (!loggedIn) {
    return <Login setLoggedIn={setLoggedIn} />
  }

  else {



    return (
      <div className="flex items-center justify-center  h-[100vh]">
        <div className={`flex ${catWindowVisible ? ' opacity-50 blur' : ''} max-sm:flex-col  items-center text-black justify-center w-full h-full  bg-gray-100`}>
          <div className="flex   bg-gray-700 flex-col p-6 items-center justify-center w-full flex-1 max-sm:flex-[0.3] h-full">
            <Image className="max-sm:w-[150px]" src="/accelor-nobg11.png" alt="logo" width={200} height={200} />
            <h2 className="text-[4rem] text-white mb-4 max-sm:text-[2.2rem]  stroked-text">PNGEN - V.01</h2>

          </div>
          <div className="flex gap-10 flex-col h-full items-center justify-center relative flex-[2]">
            {/* <Autocomplete
              options={['Electronics', 'Mechanical']}
              disablePortal
              id="combo-box-demo"
              value={broadCategory}
              onChange={(e) => setBroadCategory(e.target.value)}
              sx={{ width: 250, bgcolor: 'white' }}
              renderInput={(params) => <TextField {...params} label='Choose broad category' />}
            /> */}
            <div className="flex items-baseline gap-14 mt-10">

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
                    sx={{ bgcolor: 'white' }}
                    renderInput={(params) => <TextField  {...params} label="Choose Make" />}
                  />
                </div>

                <div className="flex flex-col  gap-4 justify-center items-center">

                  <button className="bg-green-700 px-5 w-[fit-content] rounded-md py-1 text-white hover:bg-green-600" type="submit" >Search</button>
                  {/* <h3 id="part-number" className=""></h3> */}
                </div>
              </form>

              <div className="flex flex-col gap-4">
                <h1 className="font-bold text-[1.3rem]  text-gray-800">Generate part number</h1>


                <div className="flex flex-col gap-2 items-center justify-center">
                  <div className="flex flex-col">
                    <CategoryDropdown label="Choose category" onValueChange={setChoosenCategory} setCatWindowVisible={setCatWindowVisible} catWindowVisible={catWindowVisible} />

                  </div>
                  <div className="flex flex-col">


                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      value={choosenSubcategory}
                      onChange={(e, val) => setChoosenSubcategory(val)}

                      options={subcategories}
                      sx={{ width: 300, bgcolor: 'white' }}
                      renderInput={(params) => <TextField  {...params} label="Sub Category" />}
                    />

                  </div>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add description" className="border border-gray-400 rounded-md py-4 px-3 w-full  outline-none resize-none" />
                  {/* <p className="text-[0.8rem] text-gray-500">Category or subcategory not listed?</p> */}
                  {/* <button onClick={openCategoryWindow} className=" bg-purple-900 px-3 py-2 text-white rounded-md">Add new category</button> */}
                </div>
                <button onClick={handleGenerate} id="generate-btn" type="button" className="bg-green-700 hover:bg-green-600 px-3 w-fit mx-auto py-1 rounded-md text-white">Generate Part number</button>

              </div>
            </div>
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
            <Link href='/view-mpn'><button className="absolute top-7 bg-slate-700 text-white px-5 py-3 rounded-lg left-4 hover:bg-slate-600">View Data</button></Link>

          </div>





        </div>
        <AnimatePresence>

          {catWindowVisible && <CreateCategory setCatWindowVisible={setCatWindowVisible} />}
        </AnimatePresence>

      </div>

    )
  }
}
