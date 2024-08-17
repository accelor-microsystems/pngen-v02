import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import MPN from "@/models/mpn";
import Make from "@/models/make";
import MechanicalMake from "@/models/mechanical/make";
import ToolsMake from "@/models/toolsEquip/make";
import NC_Elect_Make from "@/models/nc-elec/make";
import NC_Mech_Make from "@/models/nc-mech/make";


// export const fetchCache = 'force-no-store';

export async function GET(req) {
    connectMongoDB();
    const { searchParams } = new URL(req.url)
    const broadCategory = searchParams.get('broadCategory')
    console.log(broadCategory)
    let data = null;
    try {
        if (broadCategory === 'Electronics') {

            data = await Make.find()

        }
        else if (broadCategory === 'Mechanical') {
            data = await MechanicalMake.find()
        }
        else if (broadCategory === 'Tools and Equipments') {
            data = await ToolsMake.find()
        }
        else if (broadCategory === 'Electronics (Non COC)') {
            data = await NC_Elect_Make.find()
        }
        else if (broadCategory === 'Mechanical (Non COC)') {
            data = await NC_Mech_Make.find()
        }
        return NextResponse.json(data)

    }
    catch (err) {
        return NextResponse.json({ messge: 'err' })
    }

}

export const revalidate = 0;
