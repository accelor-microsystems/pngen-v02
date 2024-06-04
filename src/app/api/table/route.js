import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import MPN from "@/models/mpn";


export async function GET() {
    connectMongoDB();
    try {
        const data = await MPN.find()
        const response = NextResponse.json(data)
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');
        response.headers.set('Surrogate-Control', 'no-store');

        return response;
    }
    catch (err) {
        return NextResponse.json({ messge: 'err' })
    }

}

