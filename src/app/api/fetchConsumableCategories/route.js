import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import BroadCategory from "@/models/broadCategory";
import ConsumableCategory from "@/models/consumableCategory";


// export const fetchCache = 'force-no-store';

export async function GET() {
    connectMongoDB();
    try {
        const data = await ConsumableCategory.find()
        return NextResponse.json(data)

    }
    catch (err) {
        return NextResponse.json({ messge: 'err' })
    }

}

export const revalidate = 0;