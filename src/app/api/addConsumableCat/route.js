import { NextResponse } from "next/server";
import connectMongoDB from "../../../lib/mongodb";
import ConsumableCategory from "@/models/consumableCategory";

export async function POST(request) {
    connectMongoDB();
    const { category } = await request.json();
    console.log(category)

    let newCategoryNumber;

    // const doc = await Category.findOne({category: ca})


    try {

        const doc = await ConsumableCategory.findOne().sort({ categoryNumber: -1 })
        console.log(doc)
        if (doc) {
            const highestNum = doc.categoryNumber
            if (highestNum === 99) {
                return NextResponse.json({ message: "limit" })
            }
            else {

                newCategoryNumber = highestNum + 1
            }
        }
        else {
            newCategoryNumber = 1
        }

        await ConsumableCategory.create({ categoryNumber: newCategoryNumber, category: category })


        return NextResponse.json({ message: 'saved' }, { status: 200 })



        //     const doc = await ConsumableCategory.findOne({ category: category }).sort({ subcatNumber: -1 })
        //     const highestSubcatNumber = await ConsumableCategory.findOne().sort({ categoryNumber: -1 })
        //     console.log(doc)
        //     console.log(highestSubcatNumber)
        //     if (doc) {
        //         if (doc.subcatNumber === 99) {
        //             return NextResponse.json({ message: "limit" })
        //         }
        //         else {
        //             newSubcatNumber = doc.subcatNumber + 1
        //             categoryNumber = doc.categoryNumber
        //         }

        //     }

        //     else {
        //         if (highestSubcatNumber) {
        //             categoryNumber = highestSubcatNumber.categoryNumber + 1;
        //         }
        //         else {
        //             categoryNumber = 1
        //         }
        //         newSubcatNumber = 1
        //     }

        //     console.log(categoryNumber, newSubcatNumber)


        //     await ConsumableCategory.create({ categoryNumber: categoryNumber, subcatNumber: newSubcatNumber, category: category, subcategory: subcategory })
        //     return NextResponse.json({ message: "saved" }, { status: 200 })

    }
    catch (err) {
        return NextResponse.json({ message: "error" }, { status: 500 })
    }
    // return NextResponse.json({ asd: "Asd" })
}

export async function GET(request) {
    connectMongoDB();
    try {
        const docs = await ConsumableCategory.find();
        return NextResponse.json(docs, { status: 200 })
    }
    catch (err) {
        return NextResponse.json({ message: "error" }, { status: 500 })
    }
}

export const revalidate = 0;