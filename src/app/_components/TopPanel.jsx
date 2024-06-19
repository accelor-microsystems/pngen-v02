"use client"
import Image from "next/image";
import { LogoutButton } from "./Logout/logout";
import Link from "next/link";

export default function TopPanel() {
    return (
        <div className="flex w-full items-center justify-between py-6 bg-gray-100">
            <Link href='/view-data'><button className=" bg-slate-700 text-white px-5 py-3 rounded-lg mx-4 hover:bg-slate-600">View Data</button></Link>
            <LogoutButton />
        </div>
    )
}