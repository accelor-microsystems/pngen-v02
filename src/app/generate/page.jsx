"use client"
import axios from "axios";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CreateCategory from "../_components/CreateCategory";
import { Dropdown } from "primereact/dropdown";
import { Autocomplete, TextField } from "@mui/material";
import Login from "../login/page";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SpinningLoader from "../_components/SpinningLoader";
import ConsumablesWindow from "../_components/ConsumablesWindow";
import SidePanel from "../_components/SidePanel";
import { BroadCategoryContext } from "../context";
import { ProductionPage } from "../pages/ProductionPage";
import { ConsumablePage } from "../pages/ConsumablePage";
import MechElecPage from "../pages/MechElecPage";
import ElectronicsComp from "../comps/Electronics";
import ProductionComp from "../comps/Production";
import { ConsumableComp } from "../comps/Consumable";



export default function Generate() {
    const [broadCategory, setBroadCategory] = useState('')
    const router = useRouter();

    useEffect(() => {
        const username = Cookies.get('name')
        const broadCat = Cookies.get('broadCategory')
        if (username === 'Admin') {
            router.push('/admin')
        }
        console.log("BROAD_CAT: ", broadCat)
        setBroadCategory(broadCat)
    }, [])



    if (broadCategory === 'Production')
        return <ProductionComp />

    else if (broadCategory === 'Consumable')
        return <ConsumableComp />

    else if (broadCategory === 'Electronics' || broadCategory === 'Mechanical' || broadCategory === 'Tools and Equipments' || broadCategory === 'Electronics (Non COC)' || broadCategory === 'Mechanical (Non COC)') {

        return (
            <>
                <ElectronicsComp broadCategory={broadCategory} />
            </>

        )
    }
    else {
        <SpinningLoader />
    }
}

