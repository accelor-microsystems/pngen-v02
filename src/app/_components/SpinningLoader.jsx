export default function SpinningLoader({ cover }) {
    const coverStyle = 'bg-slate-800 h-full w-full flex items-center justify-center bg-opacity-40';
    return (
        <div className={`loader z-[9999] ${cover === true ? coverStyle : ''}`}>

            {/* <div className="lds-ring"><div></div><div></div><div></div><div></div></div> */}
            <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
    )
}
