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
import { useRouter } from "next/navigation";
import SpinningLoader from "./_components/SpinningLoader";
import { addMake } from "@/lib/actions";
import ConsumablesWindow from "./_components/ConsumablesWindow";
import SidePanel from "./_components/SidePanel";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const username = Cookies.get('name');
    console.log(username)
    if (username === undefined) {
      router.push('/login')
    }
    else {

      if (username === 'Admin') {
        router.push('/admin');
      }
      else if (username == 'Vadmin') {
        router.push('/view-data')
      }
      else {
        router.push('/generate')
      }
      setLoading(false);

    }
  }, [router]);

  if (loading) {
    // Optionally, you can return a loading spinner or null while checking the cookie
    return <SpinningLoader />
  }

  router.push('/login')
}
