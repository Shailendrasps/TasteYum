const mongoose = require('mongoose');

const mongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to database successfully!");

        const db = mongoose.connection.db;
        const foodItems = await db.collection("foodItems").find({}).toArray();
        const foodCategory = await db.collection("food_category").find({}).toArray();

        global.food_items = foodItems;
        global.food_category = foodCategory;
        console.log(`Loaded ${foodItems.length} food items and ${foodCategory.length} categories`);
    } catch (err) {
        console.error("Database connection failed:", err);
    }
}

module.exports = mongoDB;
