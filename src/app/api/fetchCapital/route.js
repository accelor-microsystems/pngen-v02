import connectMongoDB from "@/lib/mongodb";
import ToolsCapital from "@/models/toolsEquip/capital";
import { NextResponse } from "next/server";

export async function GET(req) {
    connectMongoDB();
    let data = null;
    try {
        data = await ToolsCapital.find()
        return NextResponse.json(data)
    }
    catch (err) {
        console.error('Error fetching data:', err); // Log the error
        return NextResponse.json({ message: 'An error occurred', error: err.message });
    }
}

export const revalidate = 0;