import mongoose, { Schema } from "mongoose";

const CategorySchema = new Schema(
    {
        categoryNumber: Number,
        subcatNumber: Number,
        category: String,
        subcategory: String,
        subcatDigits: Number,
    },
    {
        timestamps: true,
    }
)

const MechanicalCategory = mongoose.models.MechanicalCategory || mongoose.model("MechanicalCategory", CategorySchema)
export default MechanicalCategory;