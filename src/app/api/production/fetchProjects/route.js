import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import ProductionProject from "@/models/production/project";



// export const fetchCache = 'force-no-store';

export async function GET() {
    connectMongoDB();
    try {
        const projects = await ProductionProject.find()
        return NextResponse.json(projects)

    }
    catch (err) {
        console.log(err)
        return NextResponse.json({ messge: 'err' })
    }

}

export const revalidate = 0;
