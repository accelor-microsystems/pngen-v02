import SidePanel from "../_components/SidePanel";
import TopPanel from "../_components/TopPanel";


export default function Layout({ children }) {
    return (
        <div className="flex max-sm:flex-col">
            <div className="flex-[1] max-sm:flex-[0.3]">
                <SidePanel />
            </div>
            <div className="flex-[3] ">
                <TopPanel />
                <main>{children}</main>
            </div>
        </div>
    )
}