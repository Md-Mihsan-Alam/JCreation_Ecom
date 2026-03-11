require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const products = await Product.find({}, { title: 1, image: 1 });
    console.log(products);
    process.exit(0);
});
