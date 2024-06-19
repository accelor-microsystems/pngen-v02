"use client"
import { createContext, useState } from "react";

export const BroadCategoryContext = createContext(null);

function Context({ children }) {
    const [broadCategory, setBroadCategory] = useState();

    return (
        <BroadCategoryContext.Provider value={{ broadCategory, setBroadCategory }}>
            {children}
        </BroadCategoryContext.Provider>
    );
}

export default Context;