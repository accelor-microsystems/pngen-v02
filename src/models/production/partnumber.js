import mongoose, { Schema } from "mongoose";

const PartnumberSchema = new Schema(
    {
        project: String,
        category: String,
        description: String,
        partialPartNumber: Number,
        partNumber: Number,

    },
    {
        timestamps: true,
    }
)

const ProductionPartnumber = mongoose.models.ProductionPartnumber || mongoose.model("ProductionPartnumber", PartnumberSchema)
export default ProductionPartnumber;