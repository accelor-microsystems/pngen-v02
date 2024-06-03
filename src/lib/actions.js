"use server"
import MPN from "@/models/mpn";
import connectMongoDB from "./mongodb"
import { revalidatePath } from "next/cache";
import Category from "@/models/category";

export const deleteMpn = async (formData) => {
    const { id } = Object.fromEntries(formData)
    connectMongoDB();
    try {
        await MPN.findByIdAndDelete(id)

    }
    catch (err) {
        console.log(err)
    }


}

export const fetchCategories = async () => {
    connectMongoDB();
    try {
        const categories = await Category.find()
        return categories
    }
    catch (err) {
        return err;
    }
}
