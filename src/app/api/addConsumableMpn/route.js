import connectMongoDB from "@/lib/mongodb";
import ConsumableMPN from "@/models/consumableMpn";
import { NextResponse } from "next/server";

export async function POST(request) {
    connectMongoDB();
    const { category, description, partialPartNumber, partNumber } = await request.json();
    console.log(category, description, partialPartNumber, partNumber)
    try {

        await ConsumableMPN.create({ category: category, description: description, partialPartNumber: partialPartNumber, partNumber: partNumber })
        return NextResponse.json({ message: "MPN ADDED" }, { status: 200 })
    }
    catch (err) {
        return NextResponse.json({ message: "error" }, { status: 500 })
    }
}