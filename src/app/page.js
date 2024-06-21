"use client"
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import SpinningLoader from "./_components/SpinningLoader";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const username = Cookies.get('name');
    if (username === undefined) {
      router.push('/login');
    } else {
      if (username === 'Admin') {
        router.push('/admin');
      } else if (username === 'Vadmin') {
        router.push('/view-data');
      } else {
        router.push('/generate');
      }
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    // Optionally, you can return a loading spinner or null while checking the cookie
    return <SpinningLoader />;
  }

  // Return null or some fallback content if needed
  return null;
}
