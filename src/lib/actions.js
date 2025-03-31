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
    } catch (err) {
        console.log(err)
    }
    revalidatePath('/view-data')
}

export const fetchCategories = async () => {
    connectMongoDB();
    try {
        const categories = await Category.find()
        return categories
    } catch (err) {
        return err;
    }
}

export const addMake = async (formData) => {
    const { make } = Object.fromEntries(formData);
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
        const doc = await ProductionProject.findOne().sort({ projectNumber: -1 });
        if (doc) {
            newProjectNumber = doc.projectNumber + 1; // Increment from highest existing
        } else {
            newProjectNumber = 13; // Start at 13 if no projects exist
        }
        // Ensure we don’t start below 13 (for empty or pre-existing < 13 databases)
        newProjectNumber = Math.max(newProjectNumber, 13);
        // Enforce 2-digit limit (01-99)
        if (newProjectNumber > 99) {
            throw new Error("Maximum project number (99) reached!");
        }
        // Pad with leading zeros to ensure 2 digits
        newProjectNumber = String(newProjectNumber).padStart(2, '0');
        console.log(newProjectNumber, project);
        await ProductionProject.create({ projectNumber: newProjectNumber, name: project });
    } catch (err) {
        console.log(err);
        throw new Error("Failed to create project: " + err.message);
    }
}

export const addProductionCategory = async (formData) => {
    const { category, project } = Object.fromEntries(formData); // Expect project to be passed
    var newCatNumber;
    try {
        connectMongoDB();
        // Find the highest categoryNumber for this specific project
        const doc = await ProductionCategory.findOne({ project }).sort({ categoryNumber: -1 });
        if (doc) {
            newCatNumber = doc.categoryNumber + 1;
        } else {
            newCatNumber = 1; // Start at 1 for a new project
        }
        // Enforce 2-digit limit (01-99)
        if (newCatNumber > 99) {
            throw new Error("Maximum category number (99) reached for this project!");
        }
        newCatNumber = String(newCatNumber).padStart(2, '0');
        console.log(category, newCatNumber, project);
        await ProductionCategory.create({ project, categoryNumber: newCatNumber, category });
    } catch (err) {
        console.log(err);
        throw new Error("Failed to create category: " + err.message);
    }
}

export const saveProductionPN = async (newdata) => {
    connectMongoDB();
    try {
        const res = await ProductionPartnumber.create(newdata);
        console.log("Saved part number:", res);
    } catch (err) {
        console.log(err);
        throw new Error("Failed to save part number: " + err.message);
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
