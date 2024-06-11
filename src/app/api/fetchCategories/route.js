import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import Category from "@/models/category";
import MechanicalCategory from "@/models/mechanical/category";


export async function GET(req) {
    connectMongoDB();
    const { searchParams } = new URL(req.url)
    const broadCategory = searchParams.get('broadCategory')
    console.log(broadCategory)
    try {
        let data;
        if (broadCategory === 'Electronics') {
            data = await Category.find()
        }
        else if (broadCategory === 'Mechanical') {
            data = await MechanicalCategory.find()
        }
        else {
            data = null;
        }
        return NextResponse.json(data)

    }
    catch (err) {
        return NextResponse.json({ messge: 'err' })
    }

}

export const revalidate = 0;