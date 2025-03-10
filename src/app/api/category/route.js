import { NextResponse } from "next/server";
import connectMongoDB from "../../../lib/mongodb";
import Category from "../../../models/category";
import MechanicalCategory from "@/models/mechanical/category";
import ToolsCategory from "@/models/toolsEquip/category";
import NC_Elec_Category from "@/models/nc-elec/category";
import NC_Mech_Category from "@/models/nc-mech/category";

export async function POST(request) {
    await connectMongoDB();
    const { category, subcategory, subcatDigits, broadCategory, capitalNumber, capital } = await request.json();

    console.log(category, subcategory, subcatDigits, broadCategory, capitalNumber, capital);

    let newSubcatNumber, categoryNumber;

    let doc, highestSubcatNumber;
    try {
        if (broadCategory === "Electronics") {
            doc = await Category.findOne({ category }).sort({ subcatNumber: -1 });
            highestSubcatNumber = await Category.findOne().sort({ categoryNumber: -1 });
        } else if (broadCategory === "Mechanical") {
            doc = await MechanicalCategory.findOne({ category }).sort({ subcatNumber: -1 });
            highestSubcatNumber = await MechanicalCategory.findOne().sort({ categoryNumber: -1 });
        } else if (broadCategory === "Tools and Equipments") {
            // Filter by capital for Tools and Equipments
            doc = await ToolsCategory.findOne({ category, capital }).sort({ subcatNumber: -1 });
            highestSubcatNumber = await ToolsCategory.findOne({ capital }).sort({ categoryNumber: -1 });
        } else if (broadCategory === "Electronics (Non COC)") {
            doc = await NC_Elec_Category.findOne({ category }).sort({ subcatNumber: -1 });
            highestSubcatNumber = await NC_Elec_Category.findOne().sort({ categoryNumber: -1 });
        } else if (broadCategory === "Mechanical (Non COC)") {
            doc = await NC_Mech_Category.findOne({ category }).sort({ subcatNumber: -1 });
            highestSubcatNumber = await NC_Mech_Category.findOne().sort({ categoryNumber: -1 });
        }

        console.log("Existing category doc:", doc);
        console.log("Highest categoryNumber doc:", highestSubcatNumber);

        if (doc) {
            if (doc.subcatNumber === 99) {
                return NextResponse.json({ message: "limit" });
            } else {
                newSubcatNumber = doc.subcatNumber + 1;
                categoryNumber = doc.categoryNumber;
            }
        } else {
            if (highestSubcatNumber) {
                categoryNumber = highestSubcatNumber.categoryNumber + 1;
            } else {
                categoryNumber = 1; // Reset to 1 for new capital
            }
            newSubcatNumber = 1;
        }

        console.log(categoryNumber, newSubcatNumber, category, subcategory, subcatDigits);

        if (broadCategory === "Electronics") {
            await Category.create({
                categoryNumber,
                subcatNumber: newSubcatNumber,
                category,
                subcategory,
                subcatDigits,
            });
        } else if (broadCategory === "Mechanical") {
            await MechanicalCategory.create({
                categoryNumber,
                subcatNumber: newSubcatNumber,
                category,
                subcategory,
                subcatDigits,
            });
        } else if (broadCategory === "Tools and Equipments") {
            await ToolsCategory.create({
                capitalNumber,
                capital,
                categoryNumber,
                subcatNumber: newSubcatNumber,
                category,
                subcategory,
                subcatDigits,
            });
        } else if (broadCategory === "Electronics (Non COC)") {
            await NC_Elec_Category.create({
                categoryNumber,
                subcatNumber: newSubcatNumber,
                category,
                subcategory,
                subcatDigits,
            });
        } else if (broadCategory === "Mechanical (Non COC)") {
            await NC_Mech_Category.create({
                categoryNumber,
                subcatNumber: newSubcatNumber,
                category,
                subcategory,
                subcatDigits,
            });
        }
        return NextResponse.json({ message: "saved" }, { status: 200 });
    } catch (err) {
        console.error("Error in POST:", err);
        return NextResponse.json({ message: "error" }, { status: 500 });
    }
}

export async function GET(request) {
    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    const broadCategory = searchParams.get("broadCategory");
    const capital = searchParams.get("capital"); // Add capital filter
    let docs;
    try {
        if (broadCategory === "Electronics") {
            docs = await Category.find();
        } else if (broadCategory === "Mechanical") {
            docs = await MechanicalCategory.find();
        } else if (broadCategory === "Tools and Equipments") {
            docs = await ToolsCategory.find(capital ? { capital } : {}); // Filter by capital if provided
        } else if (broadCategory === "Electronics (Non COC)") {
            docs = await NC_Elec_Category.find();
        } else if (broadCategory === "Mechanical (Non COC)") {
            docs = await NC_Mech_Category.find();
        }
        return NextResponse.json(docs, { status: 200 });
    } catch (err) {
        console.error("Error in GET:", err);
        return NextResponse.json({ message: "error" }, { status: 500 });
    }
}

export const revalidate = 0;
