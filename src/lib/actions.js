"use server"
import MPN from "@/models/mpn";
import connectMongoDB from "./mongodb"
import { revalidatePath } from "next/cache";
import Category from "@/models/category";
import Make from "@/models/make";
import ProductionProject from "@/models/production/project";
import ProductionCategory from "@/models/production/category";
import ProductionPartnumber from "@/models/production/partnumber";
import { signIn } from "@/auth";

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

export const addProductionProject = async (formData) => {
    const { project } = Object.fromEntries(formData);
    var newProjectNumber;
    try {
        connectMongoDB();
        const doc = await ProductionProject.findOne().sort({ projectNumber: -1 })
        if (doc) {
            newProjectNumber = doc.projectNumber + 1;
        }
        else {
            newProjectNumber = 1;
        }
        console.log(newProjectNumber, project)
        await ProductionProject.create({ projectNumber: newProjectNumber, name: project })
    }
    catch (err) {
        console.log(err)
    }
}


export const addProductionCategory = async (formData) => {
    const { category } = Object.fromEntries(formData);
    var newCatNumber;
    try {
        connectMongoDB();
        const doc = await ProductionCategory.findOne().sort({ categoryNumber: -1 })
        if (doc) {
            newCatNumber = doc.categoryNumber + 1;
        }
        else {
            newCatNumber = 1;
        }
        console.log(category, newCatNumber)
        await ProductionCategory.create({ categoryNumber: newCatNumber, category: category })
    }
    catch (err) {
        console.log(err)
    }

}

export const saveProductionPN = async (newdata) => {
    connectMongoDB();
    try {
        const res = await ProductionPartnumber.create(newdata)
    }
    catch (err) {
        console.log(err)
    }
}

export async function doCredentialLogin(formData) {
    console.log("formData", formData);

    try {
        const response = await signIn("credentials", {
            username: formData.get("username"),
            password: formData.get("password"),
            redirect: false,
        });
        return response;
    } catch (err) {
        throw err;
    }
}