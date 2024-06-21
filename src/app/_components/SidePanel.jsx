import Image from "next/image";

export default function SidePanel() {
    return (
        <div className="flex bg-gradient-to-b from-green-900 to-purple-900 flex-col p-6 items-center justify-center w-full flex-1 max-sm:flex-[0.3] min-h-[100vh] max-sm:min-h-[10vh]">
            <Image className="max-sm:w-[150px]" src="/accelor-nobg11.png" alt="logo" width={150} height={150} />
            <h2 className="text-[3rem] text-white mb-4 max-sm:text-[2rem] font-extrabold  stroked-text">PNGEN - V.01</h2>
        </div>
    )
}
