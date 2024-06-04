import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import MPN from "@/models/mpn";

export const fetchCache = 'force-no-store';

export async function GET() {
    connectMongoDB();
    try {
        const data = await MPN.find()
        return NextResponse.json(data)

    }
    catch (err) {
        return NextResponse.json({ messge: 'err' })
    }

}

