import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import ProductionPartnumber from "@/models/production/partnumber";

export async function GET(req) {
    connectMongoDB();
    const { searchParams } = new URL(req.url)
    const project = searchParams.get('project')
    const category = searchParams.get('category')
    console.log(category)
    try {
        const data = await ProductionPartnumber.findOne({ project: project, category: category }).sort({ partialPartNumber: -1 })
        return NextResponse.json(data)

    }
    catch (err) {
        console.log(err)
        return NextResponse.json({ messge: 'err' })
    }

}

export const revalidate = 0;