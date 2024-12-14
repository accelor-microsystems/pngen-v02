import { NextResponse } from "next/server";
import connectMongoDB from "../../../lib/mongodb";
import MPN from "../../../models/mpn";
import MechanicalMPN from "@/models/mechanical/mpn";
import ToolsMPN from "@/models/toolsEquip/mpn";
import Tools from "@/app/comps/Tools";
import NC_Elec_MPN from "@/models/nc-elec/mpn";
import NC_Mech_MPN from "@/models/nc-mech/mpn";

export async function POST(request) {
    connectMongoDB();
    const { mpn, make, caprev, category, subcategory, description, unit, partialPartNumber, partNumber, broadCategory } = await request.json();
    console.log(mpn, make, caprev, category, subcategory, partialPartNumber, partNumber, broadCategory)
    try {
        if (broadCategory === 'Electronics') {
            await MPN.create({ mpn: mpn, make: make, category: category, subcategory: subcategory, description: description, unit: unit, partialPartNumber: partialPartNumber, partNumber: partNumber })
        }
        else if (broadCategory === 'Mechanical') {
            await MechanicalMPN.create({ mpn: mpn, make: make, category: category, subcategory: subcategory, description: description, unit: unit, partialPartNumber: partialPartNumber, partNumber: partNumber })
        }
        else if (broadCategory === 'Tools and Equipments') {
            await ToolsMPN.create({ mpn: mpn, make: make, caprev: caprev, category: category, subcategory: subcategory, description: description, unit: unit, partialPartNumber: partialPartNumber, partNumber: partNumber })
        }
        else if (broadCategory === 'Electronics (Non COC)') {
            await NC_Elec_MPN.create({ mpn: mpn, make: make, category: category, subcategory: subcategory, description: description, unit: unit, partialPartNumber: partialPartNumber, partNumber: partNumber })
        }
        else if (broadCategory === 'Mechanical (Non COC)') {
            await NC_Mech_MPN.create({ mpn: mpn, make: make, category: category, subcategory: subcategory, description: description, unit: unit, partialPartNumber: partialPartNumber, partNumber: partNumber })
        }

        else {
            return NextResponse.json({ message: 'Invalid Broad Category' })
        }
        return NextResponse.json({ message: "MPN ADDED" }, { status: 200 })
    }
    catch (err) {
        return NextResponse.json({ message: "error" }, { status: 500 })
    }
}

export async function GET(request) {
    connectMongoDB();
    const { searchParams } = new URL(request.url)
    const mpn = searchParams.get('mpn')
    const make = searchParams.get('make')
    const category = searchParams.get('choosenCategory')
    const subcategory = searchParams.get('choosenSubcategory')
    const broadCategory = searchParams.get('broadCategory')

    try {
        let doc = null;
        if (mpn && make) {
            if (broadCategory === 'Electronics') {
                doc = await MPN.findOne({ "mpn": mpn, "make": make })
            }
            else if (broadCategory === 'Mechanical') {
                doc = await MechanicalMPN.findOne({ "mpn": mpn, "make": make })
            }
            else if (broadCategory === 'Tools and Equipments') {
                doc = await ToolsMPN.findOne({ "mpn": mpn, "make": make })
            }
            else if (broadCategory === 'Electronics (Non COC)') {
                doc = await NC_Elec_MPN.findOne({ "mpn": mpn, "make": make })
            }
            else if (broadCategory === 'Mechanical (Non COC)') {
                doc = await NC_Mech_MPN.findOne({ "mpn": mpn, "make": make })
            }

            else {
                doc = null;
            }
            return NextResponse.json(doc, { status: 200 })
        }

        if (category && subcategory) {
            if (broadCategory === 'Electronics')
                doc = await MPN.findOne({ "category": category, "subcategory": subcategory }).sort({ partialPartNumber: -1 })
            else if (broadCategory === 'Mechanical')
                doc = await MechanicalMPN.findOne({ "category": category, "subcategory": subcategory }).sort({ partialPartNumber: -1 })
            else if (broadCategory === 'Tools and Equipments') {
                doc = await ToolsMPN.findOne({ "category": category, "subcategory": subcategory }).sort({ partialPartNumber: -1 })

            }
            else if (broadCategory === 'Electronics (Non COC)') {
                doc = await NC_Elec_MPN.findOne({ "category": category, "subcategory": subcategory }).sort({ partialPartNumber: -1 })
            }
            else if (broadCategory === 'Mechanical (Non COC)') {
                doc = await NC_Mech_MPN.findOne({ "category": category, "subcategory": subcategory }).sort({ partialPartNumber: -1 })
            }

            return NextResponse.json(doc, { status: 200 })
        }
        return NextResponse.json({ message: "nothing" })
    }
    catch (err) {
        return NextResponse.json({ message: "error" }, { status: 500 })
    }

    // return NextResponse.json({ mess: "sdf" })
    // const doc = await MPN.findOne({ "mpn": mpn, "make": make })
    // return NextResponse.json(doc)
}

// connectMongoDB();
// await MPN.findOne()
// connectMongoDB();
// await mpn.create({ mpn, make });
// export const sendMpn = async (request) => {
//     connectMongoDB();
//     const { mpn, make } = await request.json();
//     await mpn.create({ mpn, make });
// }


export const revalidate = 0;
