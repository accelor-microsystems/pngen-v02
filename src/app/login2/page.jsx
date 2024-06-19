import { doCredentialLogin } from "@/lib/actions";
import { useContext } from "react";
import ProductionComp from "../comps/Production";
import { ConsumableComp } from "../comps/Consumable";
import ElectronicsComp from "../comps/Electronics";

export default function Login2() {


    return (
        <div>
            {/* <ProductionComp /> */}
            {/* <ConsumableComp /> */}
            <ElectronicsComp broadCategory='Mechanical' />
        </div>
    );
}
