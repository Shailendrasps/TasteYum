const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://shailendrasps2001:sps@cluster0.1mzobcq.mongodb.net/tasteyummern"

const mongoDB = async () => {
    await mongoose.connect(mongoURI, { useNewUrlParser: true }, async(err, result) => {
        if (err) {
            console.log("---", err);
        } else {
            console.log("Connected to database successfully!");
            const fetched_data = await mongoose.connection.db.collection("foodItems");
            fetched_data.find({}).toArray(async function (err, data) {
                if (err) console.log(err);
                else {
                    const food_category = await mongoose.connection.db.collection("food_category");
                    food_category.find().toArray(async function (err, catData) {
                        if (err) console.log(err);
                        else {
                            global.food_items = data;
                            global.food_category = catData;
                        }
                    })
                }
            })
        }
    })
}

module.exports = mongoDB;