import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import ProductionCategory from "@/models/production/category";

export async function GET(req) {
    connectMongoDB();
    const { searchParams } = new URL(req.url);
    const project = searchParams.get('project'); // Get project from query params
    try {
        const categories = await ProductionCategory.find({ project });
        return NextResponse.json(categories);
    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: 'err' });
    }
}

export const revalidate = 0;
