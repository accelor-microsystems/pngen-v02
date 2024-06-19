import { motion } from "framer-motion"
import Image from "next/image"

export default function SplashScreen() {
    return (
        <div className="h-[100vh] flex items-center justify-center w-full  bg-gray-800">
            <motion.div initial={{ scale: 1 }} animate={{ scale: 3 }} transition={{ duration: 3 }}>
                <Image className="max-sm:w-[150px]" src="/accelor-nobg11.png" alt="logo" width={200} height={200} />
                <h2 className="text-[4rem] text-white mb-4 max-sm:text-[2.2rem]  stroked-text">PNGEN - V.01</h2>
            </motion.div>
        </div>
    )
}
