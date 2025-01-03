import mongoose, { Schema } from "mongoose";

const CategorySchema = new Schema(
    {
        capitalNumber: Number,
        capital: String,
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

const ToolsCategory = mongoose.models.ToolsCategory || mongoose.model("ToolsCategory", CategorySchema)
export default ToolsCategory;
