import Cookies from "js-cookie";
import { useRouter } from "next/navigation"

export function LogoutButton() {
    const router = useRouter();
    const handleLogout = () => {
        Cookies.remove('name')
        Cookies.remove('broadCategory')
        router.push('/login')
    }
    return (
        <button onClick={handleLogout} className="mx-5 border bg-red-700 px-3 py-1 text-white rounded-md">Logout</button>
    )
}