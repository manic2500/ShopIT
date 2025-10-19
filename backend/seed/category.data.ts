import { Types } from "mongoose";

// 🎯 1. Extract the raw category data from your JSON response structure
const rawCategoryData = [
    { "id": "68f35dda24b2e034e402491d", "name": "Electronics" },
    { "id": "68f35dda24b2e034e402491e", "name": "Cameras" },
    { "id": "68f35dda24b2e034e402491f", "name": "Laptops" },
    { "id": "68f35dda24b2e034e4024920", "name": "Accessories" },
    { "id": "68f35dda24b2e034e4024921", "name": "Mobiles" },
    { "id": "68f35dda24b2e034e4024922", "name": "Headphones" },
    { "id": "68f35dda24b2e034e4024923", "name": "Food" },
    { "id": "68f35dda24b2e034e4024924", "name": "Books" },
    { "id": "68f35dda24b2e034e4024925", "name": "Sports" },
    { "id": "68f35dda24b2e034e4024926", "name": "Outdoor" },
    { "id": "68f35dda24b2e034e4024927", "name": "Home" },
    { "id": "68f371f8c62962a3970c9fd1", "name": "Travel" }
];

// 2. Map the raw data to include Mongoose ObjectId for the _id field
export const categoriesData = rawCategoryData.map(c => ({
    _id: new Types.ObjectId(c.id), // 💡 CONVERT STRING ID TO MONGOOSE OBJECTID
    name: c.name
}));

