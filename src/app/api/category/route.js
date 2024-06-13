import { NextResponse } from "next/server";
import connectMongoDB from "../../../lib/mongodb";
import Category from "../../../models/category";
import MechanicalCategory from "@/models/mechanical/category";

export async function POST(request) {
    connectMongoDB();
    const { category, subcategory, subcatDigits, broadCategory } = await request.json();
    console.log(category, subcategory, subcatDigits, broadCategory)

    let newSubcatNumber, categoryNumber;

    // const doc = await Category.findOne({category: ca})
    let doc, highestSubcatNumber;
    try {
        if (broadCategory === 'Electronics') {
            doc = await Category.findOne({ category: category }).sort({ subcatNumber: -1 })
            highestSubcatNumber = await Category.findOne().sort({ categoryNumber: -1 })
        }
        else if (broadCategory === 'Mechanical') {
            doc = await MechanicalCategory.findOne({ category: category }).sort({ subcatNumber: -1 })
            highestSubcatNumber = await MechanicalCategory.findOne().sort({ categoryNumber: -1 })
        }

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
            if (highestSubcatNumber) {
                categoryNumber = highestSubcatNumber.categoryNumber + 1;
            }
            else {
                categoryNumber = 1
            }
            newSubcatNumber = 1
        }

        console.log(categoryNumber, newSubcatNumber)

        if (broadCategory === 'Electronics')
            await Category.create({ categoryNumber: categoryNumber, subcatNumber: newSubcatNumber, category: category, subcategory: subcategory, subcatDigits: subcatDigits })
        else if (broadCategory === 'Mechanical')
            await MechanicalCategory.create({ categoryNumber: categoryNumber, subcatNumber: newSubcatNumber, category: category, subcategory: subcategory, subcatDigits: subcatDigits })

        return NextResponse.json({ message: "saved" }, { status: 200 })

    }
    catch (err) {
        return NextResponse.json({ message: "error" }, { status: 500 })
    }
    // return NextResponse.json({ asd: "Asd" })
}

export async function GET(request) {
    connectMongoDB();
    const { searchParams } = new URL(request.url)
    const broadCategory = searchParams.get('broadCategory')
    let docs;
    try {
        if (broadCategory === 'Electronics')
            docs = await Category.find();
        if (broadCategory === 'Mechanical')
            docs = await MechanicalCategory.find();
        return NextResponse.json(docs, { status: 200 })
    }
    catch (err) {
        return NextResponse.json({ message: "error" }, { status: 500 })
    }
}

export const revalidate = 0;