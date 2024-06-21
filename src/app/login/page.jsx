"use client"
import axios from "axios"
import { useState } from "react"
import Router from "next/router"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import Cookies from "js-cookie"
import SpinningLoader from "../_components/SpinningLoader"

export default function Login({ setLoggedIn }) {
    const router = useRouter();
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleSignIn = async () => {
        if (username && password) {
            setLoading(true)
            try {

                const res = await axios.get('/api/userExist/',
                    {
                        params: {
                            username: username,
                            password: password
                        }
                    }
                )
                if (res.data) {
                    if (res.data.message === 200) {
                        if (res.data.user.username === 'vadmin') {
                            router.push('/view-data')
                        }
                        else {
                            router.push('/generate')
                        }
                        setLoading(false)

                    }
                    else {
                        setLoading(false)
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
        <div className=" flex-[2]  max-sm:flex-col h-[100vh]">
            <div className="flex relative     items-center justify-center flex-col h-full gap-2 bg-gray-100">
                {/* <div className="absolute font-extrabold top-0 text-[10rem] text-gray-200 opensans">Welcome to PNGEN</div> */}
                <div className="flex flex-col w-[40%] max-sm:w-full px-7 gap-2 bg-glass py-10">
                    <h1 className="text-[2rem] mb-5  max-sm:text-[1.8rem] font-bold">

                        Log in to proceed
                    </h1>
                    <input className="border-l-4 border-slate-300 p-3 outline-none shadow-sm focus:border-slate-500 " value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Enter username" />
                    <input className="border-l-4 border-slate-300 p-3 outline-none shadow-sm focus:border-slate-500 " value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Enter password" />
                    <button className="bg-green-700 px-5 mt-3 btn-styled py-2 text-white hover:bg-green-600" onClick={handleSignIn}>Sign in</button>
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
                {loading && <SpinningLoader cover={true} />}
            </div>
        </div>
    )
}
