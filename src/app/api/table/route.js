import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import MPN from "@/models/mpn";
import MechanicalMPN from "@/models/mechanical/mpn";
import ConsumableMPN from "@/models/consumableMpn";
import ProductionPartnumber from "@/models/production/partnumber";
import ToolsMPN from "@/models/toolsEquip/mpn";
import NC_Elec_MPN from "@/models/nc-elec/mpn";
import NC_Mech_MPN from "@/models/nc-mech/mpn";

// export const fetchCache = 'force-no-store';

export async function GET(req) {
    connectMongoDB();
    const { searchParams } = new URL(req.url)
    const broadCategory = searchParams.get('broadCategory')
    console.log(broadCategory)
    let data = null;
    try {
        if (broadCategory === 'Electronics')
            data = await MPN.find()
        else if (broadCategory === 'Mechanical')
            data = await MechanicalMPN.find()
        else if (broadCategory === 'Consumable')
            data = await ConsumableMPN.find()
        else if (broadCategory === 'Production')
            data = await ProductionPartnumber.find()
        else if (broadCategory === 'Tools and Equipments')
            data = await ToolsMPN.find()
        else if (broadCategory === 'Electronics (Non COC)')
            data = await NC_Elec_MPN.find()
        else if (broadCategory === 'Mechanical (Non COC)')
            data = await NC_Mech_MPN.find()

        return NextResponse.json(data)

    }
    catch (err) {
        return NextResponse.json({ messge: 'err' })
    }

}

export const revalidate = 0;
