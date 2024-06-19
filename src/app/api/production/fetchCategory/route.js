import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import ProductionCategory from "@/models/production/category";



// export const fetchCache = 'force-no-store';

export async function GET() {
    connectMongoDB();
    try {
        const categories = await ProductionCategory.find()
        return NextResponse.json(categories)

    }
    catch (err) {
        console.log(err)
        return NextResponse.json({ messge: 'err' })
    }

}

export const revalidate = 0;