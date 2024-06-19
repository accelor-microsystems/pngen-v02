"use client"
import { useLayoutEffect, useState } from "react";
import BCDropdown from "../_components/BCDropdown/BCDropdown";
import SidePanel from "../_components/SidePanel";
import { ProductionPage } from "../pages/ProductionPage";
import { redirect, useRouter } from "next/navigation";
import { LogoutButton } from "../_components/Logout/logout";
import { ConsumablePage } from "../pages/ConsumablePage";
import MechElecPage from "../pages/MechElecPage";
import ProductionComp from "../comps/Production";
import { ConsumableComp } from "../comps/Consumable";
import Link from "next/link";
import ElectronicsComp from "../comps/Electronics";
import Cookies from "js-cookie";

export default function AdminPage() {
    const router = useRouter()
    const [broadCategory, setBroadCategory] = useState('')
    const handleBChange = (e, val) => {
        console.log(val)
        setBroadCategory(val)
    }

    const renderComponent = () => {
        switch (broadCategory) {
            case 'Production':
                return <ProductionComp />;
            case 'Consumable':
                return <ConsumableComp />;
            case 'Mechanical':
                return <ElectronicsComp broadCategory={broadCategory} />;
            case 'Electronics':
                return <ElectronicsComp broadCategory={broadCategory} />;
            default:
                return <div className="text-center font-bold">Select broad category to generate part numbers</div>;
        }
    };

    useLayoutEffect(() => {
        const logged = Cookies.get('name')
        if (logged !== 'Admin') {
            redirect('/')
        }
    }, [])


    return (
        <div className="flex">
            <SidePanel />
            <div className="flex-[3] flex flex-col items-center ">
                <div className="flex justify-between items-center py-5 px-3 w-full bg-gray-100 shadow-md">
                    <Link href='/view-data'><button className=" bg-slate-700 text-white px-5 py-3 rounded-lg hover:bg-slate-600">View Data</button></Link>
                    <BCDropdown onChange={handleBChange} />
                    <LogoutButton />
                </div>
                <div className="w-full  mt-10">
                    {renderComponent()}
                </div>
            </div>
        </div>
    )
}