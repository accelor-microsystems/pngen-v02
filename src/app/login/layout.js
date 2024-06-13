import SidePanel from "../_components/SidePanel";


export default function Layout({ children }) {
    return (
        <div className="flex">
            <div className="flex-[1]">

                <SidePanel />
            </div>
            <div className="flex-[2]">

                <main>{children}</main>
            </div>
        </div>
    )
}