import connectMongoDB from "@/lib/mongodb";
import Make from "@/models/make";
import MechanicalMake from "@/models/mechanical/make";
import NC_Elect_Make from "@/models/nc-elec/make";
import NC_Mech_Make from "@/models/nc-mech/make";
import ToolsMake from "@/models/toolsEquip/make";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request) {
    connectMongoDB();
    const { make, broadCategory } = await request.json();
    console.log(make)
    try {
        if (broadCategory === 'Electronics') {
            await Make.create({ name: make })
            return NextResponse.json({ make: make }, { status: 200 })
        }
        else if (broadCategory === 'Mechanical') {
            await MechanicalMake.create({ name: make })
            return NextResponse.json({ make: make }, { status: 200 })
        }
        else if (broadCategory === 'Tools and Equipments') {
            await ToolsMake.create({ name: make })
            return NextResponse.json({ make: make }, { status: 200 })
        }
        else if (broadCategory === 'Electronics (Non COC)') {
            await NC_Elect_Make.create({ name: make })
            return NextResponse.json({ make: make }, { status: 200 })
        }
        else if (broadCategory === 'Mechanical (Non COC)') {
            await NC_Mech_Make.create({ name: make })
            return NextResponse.json({ make: make }, { status: 200 })
        }


    }
    catch (err) {
        return NextResponse.json({ message: "error" }, { status: 500 })
    }
}
