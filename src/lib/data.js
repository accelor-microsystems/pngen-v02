import Make from "@/models/make"
import connectMongoDB from "./mongodb"

export const fetchMakes = async (broadCategory) => {
    connectMongoDB();
    console.log(broadCategory)
    try {
        if (broadCategory === 'Electronics') {
            const makes = await Make.find()
            return makes;
        }
    }
    catch (err) {
        console.log(err)
    }
}