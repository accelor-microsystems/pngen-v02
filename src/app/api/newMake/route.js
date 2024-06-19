import connectMongoDB from "@/lib/mongodb";
import Make from "@/models/make";
import MechanicalMake from "@/models/mechanical/make";
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

    }
    catch (err) {
        return NextResponse.json({ message: "error" }, { status: 500 })
    }
}