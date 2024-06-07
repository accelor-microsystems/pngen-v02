import connectMongoDB from "@/lib/mongodb";
import Make from "@/models/make";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request) {
    connectMongoDB();
    const { make } = await request.json();
    console.log(make)
    try {

        await Make.create({ name: make })
        return NextResponse.json({ make: make }, { status: 200 })
    }
    catch (err) {
        return NextResponse.json({ message: "error" }, { status: 500 })
    }
}