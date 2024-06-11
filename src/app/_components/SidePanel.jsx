import Image from "next/image";

export default function SidePanel() {
    return (
        <div className="flex  bg-gray-700 flex-col p-6 items-center justify-center w-full flex-1 max-sm:flex-[0.3] h-[100vh]">
            <Image className="max-sm:w-[150px]" src="/accelor-nobg11.png" alt="logo" width={200} height={200} />
            <h2 className="text-[4rem] text-white mb-4 max-sm:text-[2.2rem]  stroked-text">PNGEN - V.01</h2>
        </div>
    )
}