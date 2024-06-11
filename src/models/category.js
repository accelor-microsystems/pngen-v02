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

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema)
export default Category;