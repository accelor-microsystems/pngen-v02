import { NextResponse } from "next/server";
import connectMongoDB from "../../../lib/mongodb";
import MPN from "../../../models/mpn";


export async function GET(request) {
    connectMongoDB();
    const data = await MPN.find()
    return NextResponse.json(data)

}

