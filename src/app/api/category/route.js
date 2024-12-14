import { NextResponse } from "next/server";
import connectMongoDB from "../../../lib/mongodb";
import Category from "../../../models/category";
import MechanicalCategory from "@/models/mechanical/category";
import ToolsCategory from "@/models/toolsEquip/category";
import Tools from "@/app/comps/Tools";
import NC_Elec_Category from "@/models/nc-elec/category";
import NC_Mech_Category from "@/models/nc-mech/category";
import ToolsCapital from "@/models/toolsEquip/capital";

export async function POST(request) {
    connectMongoDB();
    const { category, subcategory, subcatDigits, broadCategory, capitalNumber, capital } = await request.json();

    console.log(category, subcategory, subcatDigits, broadCategory, capitalNumber, capital)

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
        else if (broadCategory === 'Tools and Equipments') {
            doc = await ToolsCategory.findOne({ category: category }).sort({ subcatNumber: -1 })
            highestSubcatNumber = await ToolsCategory.findOne().sort({ categoryNumber: -1 })
        }
        else if (broadCategory === 'Electronics (Non COC)') {
            doc = await NC_Elec_Category.findOne({ category: category }).sort({ subcatNumber: -1 })
            highestSubcatNumber = await NC_Elec_Category.findOne().sort({ categoryNumber: -1 })
        }
        else if (broadCategory === 'Mechanical (Non COC)') {
            doc = await NC_Mech_Category.findOne({ category: category }).sort({ subcatNumber: -1 })
            highestSubcatNumber = await NC_Mech_Category.findOne().sort({ categoryNumber: -1 })
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

        console.log(categoryNumber, newSubcatNumber, category, subcategory, subcatDigits)

        if (broadCategory === 'Electronics')
            await Category.create({ categoryNumber: categoryNumber, subcatNumber: newSubcatNumber, category: category, subcategory: subcategory, subcatDigits: subcatDigits })
        else if (broadCategory === 'Mechanical')
            await MechanicalCategory.create({ categoryNumber: categoryNumber, subcatNumber: newSubcatNumber, category: category, subcategory: subcategory, subcatDigits: subcatDigits })
        else if (broadCategory === 'Tools and Equipments') {
            await ToolsCategory.create({ capitalNumber: capitalNumber, capital: capital, categoryNumber: categoryNumber, subcatNumber: newSubcatNumber, category: category, subcategory: subcategory, subcatDigits: subcatDigits })

        }
        else if (broadCategory === 'Electronics (Non COC)') {
            await NC_Elec_Category.create({ categoryNumber: categoryNumber, subcatNumber: newSubcatNumber, category: category, subcategory: subcategory, subcatDigits: subcatDigits })
        }
        else if (broadCategory === 'Mechanical (Non COC)') {
            await NC_Mech_Category.create({ categoryNumber: categoryNumber, subcatNumber: newSubcatNumber, category: category, subcategory: subcategory, subcatDigits: subcatDigits })
        }
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
        if (broadCategory === 'Tools and Equipments')
            docs = await ToolsCategory.find();
        if (broadCategory === 'Electronics (Non COC)')
            docs = await NC_Elec_Category.find();
        if (broadCategory === 'Mechanical (Non COC)')
            docs = await NC_Mech_Category.find();
        return NextResponse.json(docs, { status: 200 })
    }
    catch (err) {
        return NextResponse.json({ message: "error" }, { status: 500 })
    }
}

export const revalidate = 0;
