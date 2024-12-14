import connectMongoDB from "@/lib/mongodb";
import ToolsCapital from "@/models/toolsEquip/capital";
import { NextResponse } from "next/server";

export async function POST(request) {
    connectMongoDB();
    const { capitalNumber, capitalName } = await request.json();
    await ToolsCapital.create({ capitalNumber: capitalNumber, capital: capitalName })
    return NextResponse.json({ status: 200 })

}