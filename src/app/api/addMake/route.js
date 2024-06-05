import connectMongoDB from "@/lib/mongodb";
import Make from "@/models/make";
import { NextResponse } from "next/server";

export async function GET() {
    connectMongoDB();
    try {
        const data = await Make.find()
        if (data) {

            return NextResponse.json(data)
        }
        else {
            return NextResponse.json({ message: 'no-data' })
        }
    }
    catch (err) {
        return NextResponse.json({ err })
    }

}
export const revalidate = 0;
