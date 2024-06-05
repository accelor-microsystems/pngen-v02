"use client"
import axios from "axios"
import { useState } from "react"
import Router from "next/router"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import Cookies from "js-cookie"

export default function Login({ setLoggedIn }) {
    const router = useRouter();
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState(null)

    const handleSignIn = async () => {
        if (username && password) {

            try {

                const res = await axios.get('/api/userExist/',
                    {
                        params: {
                            username: username,
                            password: password
                        }
                    }
                )
                if (res) {
                    if (res.data.message === 200) {
                        // setLoggedIn(true)
                        router.push('/')

                    }
                    else {
                        setMessage('Incorrect password or username')
                    }
                }
            }
            catch (err) {
                console.log(err)
            }
        }
        else {
            setMessage("Enter both username and password")
        }
    }

    return (
        <div className="flex max-sm:flex-col h-[100vh]">

            <div className="flex   bg-gray-700 flex-col p-6 items-center justify-center w-full flex-1 max-sm:flex-[0.3] h-full">
                <Image className="max-sm:w-[150px]" src="/accelor-nobg11.png" alt="logo" width={200} height={200} />
                <h2 className="text-[4rem] text-white mb-4 max-sm:text-[2.2rem]  stroked-text">PNGEN - V.01</h2>
            </div>
            <div className="flex flex-[2] items-center justify-center flex-col h-full gap-2 bg-gray-100">
                <h1 className="text-[2.4rem] max-sm:text-[1.8rem] font-bold my-5">
                    Log in to proceed
                </h1>
                <div className="flex flex-col w-[40%] max-sm:w-full px-4 gap-2">

                    <input className="border p-2 outline-none " value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Enter username" />
                    <input className="border p-2 outline-none " value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Enter password" />
                    <button className="bg-green-700 px-5 mt-3  py-2 text-white hover:bg-green-600" onClick={handleSignIn}>Sign in</button>
                </div>
                <AnimatePresence>

                    {message &&
                        <motion.div initial={{ y: -500 }} animate={{ y: 0 }} exit={{ y: -500 }} className="absolute top-5 py-[10px] px-[15px] bg-red-700 text-white flex  items-center justify-center gap-3  rounded-md shadow-sm shadow-black ">
                            <h1 className="">{message}</h1>
                            <button onClick={() => setMessage(null)} className="">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                                    <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm2.78-4.22a.75.75 0 0 1-1.06 0L8 9.06l-1.72 1.72a.75.75 0 1 1-1.06-1.06L6.94 8 5.22 6.28a.75.75 0 0 1 1.06-1.06L8 6.94l1.72-1.72a.75.75 0 1 1 1.06 1.06L9.06 8l1.72 1.72a.75.75 0 0 1 0 1.06Z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </motion.div>
                    }
                </AnimatePresence>
            </div>
        </div>
    )
}
