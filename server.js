// import 
require("dotenv").config()
const express = require("express")
const morgan = require ("morgan")
const methodOverride = require("method-override")
const mongoose = require("mongoose")

// create express app
const app = express()

// setup inputs for our connect function
const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }

// establish mongo connection 
mongoose.connect(process.env.MONGO, CONFIG)

// mongoose connection events
mongoose.connection
.on("open", () => console.log("Connected to Mongo"))
.on("close", () => console.log("Disconnected to Mongo"))
.on("error", (error) => console.log(error))

// product model
const {Schema, model} = mongoose 
const productSchema = new Schema({
    title: String,
    type: String,
    description: String,
    image: String, 
    price: Number
})
const Product = model("Product", productSchema)

// register my middleware
app.use(morgan("tiny"))
app.use("/static", express.static("public"))
app.use(express.urlencoded({extended: true}))
// app.use("/", (req, res) => {
//     res.send("<h1>Your server is running.. better catch it!</h1>")
// })

// routes

app.get("/products/seed", (req, res) => {

    // array of starter fruits
    const startProducts = [
          { title: "Yin Yang Wolf Mates Triblend T-Shirt", type: "T-Shirt", description: "Relaxed Fit; Stretchy and Breathable", image: "https://cdn11.bigcommerce.com/s-86394/images/stencil/1280x1280/products/24518/120110/5456870042__57350.1649285605.jpg?c=2", price: 35 },
          { title: "White Wolf Moon Women's V-Neck Triblend Tee", type: "T-Shirt", description: "Our tri-blend tee is a relaxed, fitted style made of 25% cotton, 25% rayon, and 50% polyester, which basically makes it the softest t-shirt you will ever own.", image: "https://cdn11.bigcommerce.com/s-86394/images/stencil/1280x1280/products/26000/121898/4156860263__96275.1650059917.jpg?c=2", price: 35 },
          { title: "Retro Mothman Lightweight Hoodie Tee", type: "Hoodie", description: "In the unofficial ranking of cryptid folklore, we have to give Mothman a legit 10/10 for creepiness.", image: "https://cdn11.bigcommerce.com/s-86394/images/stencil/1280x1280/products/26321/122295/4926700741__62361.1664710760.jpg?c=2", price: 50 },
          { title: "Namaste Watercolor Women's Scoop-Neck Tee - Black", type: "T-Shirt", description: "Wear this Namaste Watercolor t-shirt when you need to be reminded to look inward for courage, strength, and peace in a world", image: "https://cdn11.bigcommerce.com/s-86394/images/stencil/1280x1280/products/22486/117958/2791600100__40903.1634825452.jpg?c=2", price: 35 },
          { title: "Big Face Tribal White Tiger Customized T-Shirt", type: "T-Shirt", description: "This cool graphic shirt is a great depiction of the fierce White Tiger.", image: "https://cdn11.bigcommerce.com/s-86394/images/stencil/1280x1280/products/17891/110505/10_3953_0699_web__75363.1575901486.jpg?c=2", price: 35 },
        ]
  
    // Delete all fruits
    Product.deleteMany({}, (err, data) => {
      // Seed Starter Fruits
      Product.create(startProducts,(err, data) => {
          // send created fruits as response to confirm creation
          res.json(data);
        }
      );
    });
  });


// start the server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
console.log(`Who let the dogs out on port ${PORT}?`)
})