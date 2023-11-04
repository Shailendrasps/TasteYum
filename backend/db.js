const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://shailendrasps2001:sps@cluster0.1mzobcq.mongodb.net/tasteyummern"

const mongoDB = async () => {
    await mongoose.connect(mongoURI, { useNewUrlParser: true }, (err, result) => {
        if (err) {
            console.log("---", err);
        } else {
            console.log("Connected to database successfully!");
            const fetched_data = mongoose.connection.db.collection("foodItems");
            fetched_data.find({}).toArray(function (err, data) {
                if (err) console.log(err);
                else {
                    const food_category = mongoose.connection.db.collection("food_category");
                    food_category.find().toArray(function (err, catData) {
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