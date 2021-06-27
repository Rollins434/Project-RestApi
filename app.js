const express = require("express");
//const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Product = require("./models/product");
const cors = require("cors");

//Routes
const productsRoutes = require("./routes/products")
const categoriesRoutes =  require ("./routes/categories");
const app = express();

app.use(cors());
app.options("*", cors());

require("dotenv/config");

const api = process.env.API_URL;


//Middlewares
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

//routes registered
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/categories`, categoriesRoutes);



//making connection with Mongo DB
mongoose.connect(process.env.CONNECTION_STRING,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify:false,
    useCreateIndex: true,
    dbName: "e-database",
})
.then(() => {
    console.log("Database connected");
})
.catch((err) => {
    console.log("error: ", err);
})

app.listen(3000,() => {
    console.log("Server is up and running");
})