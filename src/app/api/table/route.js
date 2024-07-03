import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import MPN from "@/models/mpn";
import MechanicalMPN from "@/models/mechanical/mpn";
import ConsumableMPN from "@/models/consumableMpn";
import ProductionPartnumber from "@/models/production/partnumber";
import ToolsMPN from "@/models/toolsEquip/mpn";

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

        return NextResponse.json(data)

    }
    catch (err) {
        return NextResponse.json({ messge: 'err' })
    }

}

export const revalidate = 0;
