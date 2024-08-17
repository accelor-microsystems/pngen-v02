import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import Category from "@/models/category";
import MechanicalCategory from "@/models/mechanical/category";
import ToolsCategory from "@/models/toolsEquip/category";
import NC_Elec_Category from "@/models/nc-elec/category";
import NC_Mech_Category from "@/models/nc-mech/category";


export async function GET(req) {
    connectMongoDB();
    const { searchParams } = new URL(req.url)
    const broadCategory = searchParams.get('broadCategory')
    console.log(broadCategory)
    try {
        let data;
        if (broadCategory === 'Electronics') {
            data = await Category.find()
        }
        else if (broadCategory === 'Mechanical') {
            data = await MechanicalCategory.find()
        }
        else if (broadCategory === 'Tools and Equipments') {
            data = await ToolsCategory.find()
        }
        else if (broadCategory === 'Electronics (Non COC)') {
            data = await NC_Elec_Category.find()
        }
        else if (broadCategory === 'Mechanical (Non COC)') {
            data = await NC_Mech_Category.find()
        }
        else {
            data = null;
        }
        return NextResponse.json(data)

    }
    catch (err) {
        return NextResponse.json({ messge: 'err' })
    }

}

export const revalidate = 0;
