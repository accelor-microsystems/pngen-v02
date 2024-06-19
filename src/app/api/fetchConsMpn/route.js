import connectMongoDB from "@/lib/mongodb";
import ConsumableMPN from "@/models/consumableMpn";
import { NextResponse } from "next/server";

export async function GET(request) {
    connectMongoDB();
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    if (category) {

        try {


            const doc = await ConsumableMPN.findOne({ "category": category }).sort({ partialPartNumber: -1 })
            console.log(doc)

            return NextResponse.json(doc)

        }
        catch (err) {
            return NextResponse.json({ message: "error" }, { status: 500 })
        }
    }

    else {
        const doc = await ConsumableMPN.find()
        return NextResponse.json(doc)
    }

    // const doc = await MPN.findOne({ "mpn": mpn, "make": make })
    // return NextResponse.json(doc)
}


export const revalidate = 0; 