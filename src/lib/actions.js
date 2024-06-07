"use server"
import MPN from "@/models/mpn";
import connectMongoDB from "./mongodb"
import { revalidatePath } from "next/cache";
import Category from "@/models/category";
import Make from "@/models/make";

export const deleteMpn = async (formData) => {
    const { id } = Object.fromEntries(formData)
    connectMongoDB();
    try {
        await MPN.findByIdAndDelete(id)

    }
    catch (err) {
        console.log(err)
    }

    revalidatePath('/view-data')

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

export const addMake = async (formData) => {
    const { make } =
        Object.fromEntries(formData);

    console.log(make)

    try {
        connectMongoDB();
        const res = await Make.create({ name: make })
        console.log(res)
    } catch (err) {
        console.log(err);
        throw new Error("Failed to create make!");
    }


};