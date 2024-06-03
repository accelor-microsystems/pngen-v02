import { NextResponse } from "next/server";
import connectMongoDB from "../../../lib/mongodb";
import Category from "../../../models/category";

export async function POST(request) {
    connectMongoDB();
    const { category, subcategory, subcatDigits } = await request.json();
    console.log(category, subcategory, subcatDigits)

    let newSubcatNumber, categoryNumber;

    // const doc = await Category.findOne({category: ca})

    try {
        const doc = await Category.findOne({ category: category }).sort({ subcatNumber: -1 })
        const highestSubcatNumber = await Category.findOne().sort({ categoryNumber: -1 })
        console.log(doc)
        console.log(highestSubcatNumber)
        if (doc) {
            if (doc.subcatNumber === 99) {
                return NextResponse.json({ message: "limit" })
            }
            else {
                newSubcatNumber = doc.subcatNumber + 1
                categoryNumber = doc.categoryNumber
            }

        }

        else {
            newSubcatNumber = 1
            categoryNumber = (highestSubcatNumber.categoryNumber + 1) || 1;
        }

        console.log(categoryNumber, newSubcatNumber)


        await Category.create({ categoryNumber: categoryNumber, subcatNumber: newSubcatNumber, category: category, subcategory: subcategory, subcatDigits: subcatDigits })
        return NextResponse.json({ message: "saved" }, { status: 200 })

    }
    catch (err) {
        return NextResponse.json({ message: "error" }, { status: 500 })
    }
    // return NextResponse.json({ asd: "Asd" })
}

export async function GET(request) {
    connectMongoDB();
    try {
        const docs = await Category.find();
        console.log(docs)
        return NextResponse.json(docs, { status: 200 })
    }
    catch (err) {
        return NextResponse.json({ message: "error" }, { status: 500 })
    }
}