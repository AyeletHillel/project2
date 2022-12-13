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
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"))
// app.use("/", (req, res) => {
//     res.send("<h1>Your server is running.. better catch it!</h1>")
// })

// routes

// index route
app.get("/products", (req, res) => {
    // get all products
    Product.find({})
    .then((products) => {
        res.render("products/index.ejs", { products })

    })
})

// new route
app.get("/products/new", (req, res) => {
  res.render("products/new.ejs")
})

// post new product
app.post('/products', (req, res) => {
  Product.create(req.body, (err, createdProduct) => {
    console.log(createdProduct)
    res.redirect("/products")
  })
})

// edit route
app.get("/products/:id/edit", (req, res) =>{
  const id = req.params.id
  Product.findById(id, (err, product) => {
    // res.json(product)
    res.render("products/edit.ejs", { product })
  })
})

// update route
app.put("/products/:id", (req, res) => {
  const id = req.params.id
  Product.findByIdAndUpdate(id, req.body, {new: true}, (err, product) => {
    
    res.redirect("/products")
  })
})

app.delete("/products/:id", (req, res) => {
  const id = req.params.id
  Product.findByIdAndRemove(id, (err, product) =>{
    res.redirect("/products")
  })
})


app.get("/products/seed", (req, res) => {

    // array of starter producs
    const startProducts = [
          { title: "Normal Is Boring", type: "Laptop Sleeve", description: "Relaxed Fit; Stretchy and Breathable", image: "https://i.etsystatic.com/12080211/r/il/b70219/4256225538/il_1588xN.4256225538_tayt.jpg", price: 35 },
          { title: "Feminist Royal Crown", type: "Laptop Sleeve", description: "Our tri-blend tee is a relaxed, fitted style made of 25% cotton, 25% rayon, and 50% polyester, which basically makes it the softest t-shirt you will ever own.", image: "https://i.etsystatic.com/12080211/r/il/3e3d42/4303258685/il_1588xN.4303258685_j248.jpg", price: 35 },
          { title: "Flower Crown Queen", type: "Laptop Sleeve", description: "Feminine Powerful Artwork Laptop Sleeve", image: "https://i.etsystatic.com/12080211/r/il/120467/4255861722/il_1588xN.4255861722_e2ep.jpg", price: 50 },
          { title: "Flower Love", type: "Tote Bag Purse", description: "Wear this Namaste Watercolor t-shirt when you need to be reminded to look inward for courage, strength, and peace in a world", image: "https://i.etsystatic.com/12080211/r/il/9977d7/4255749296/il_1588xN.4255749296_rju3.jpg", price: 35 },
          { title: "Royal Tea Cup", type: "Cup", description: "Contemporary African Art Feminine Hearts Love Earrings", image: "https://i.etsystatic.com/12080211/r/il/3a3911/4303234505/il_1588xN.4303234505_qu4i.jpg", price: 15 },
        ]
  
    // Delete all products
    Product.deleteMany({}, (err, data) => {
      // Seed Starter Products
      Product.create(startProducts,(err, data) => {
          // send created products as response to confirm creation
          res.json(data);
        }
      );
    });
  });

// show route
app.get("/products/:id", (req, res) => {

  // get the id from params
  const id = req.params.id

  // find the particular product from the database
 Product.findById(id, (err, product) => {
      // render the template with the data from the database
      res.render("products/show.ejs", { product })
  })
})

// start the server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
console.log(`Who let the dogs out on port ${PORT}?`)
})