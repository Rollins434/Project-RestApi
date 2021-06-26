const { Product } = require("../models/product");
const express = require("express");
const { Category } = require("../models/category");
const router = express.Router();
const mongoose = require("mongoose");

// get all products
router.get(`/`, async (req, res) => {

    let filter = {}
    if(req.query.categories){
        filter = {category:req.query.categories};
    }
  const productList = await Product.find(filter).populate("category");

  if (!productList) {
    res.status(500).send({ success: false });
  }
  res.send(productList);
});

// Get product by individual id
router.get(`/:id`, async (req, res) => {
  
  try {
    
    const product = await Product.findById(req.params.id);
    res.send(product);
  } catch (err) {
    if (!product) {
      res.status(500).send({ success: false });
    }
  }
});

// post a product 
router.post("/", async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid Category");
  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    stock: req.body.stock,
  });
  product
    .save()
    .then((createdProduct) => {
      res.status(201).send(createdProduct);
    })
    .catch((err) => {
      res.status(500).send({
        error: err,
        success: false,
      });
    });
});

//post a product with multiple categories
router.post('/', async (req,res) =>{
  const {product} = req.body;
  const newProduct = await Product.create(product);
  await Category.updateMany({ '_id': newProduct.categories }, { $push: { products: newProduct._id } });
  return res.send(newProduct);

})






//update product
router.put('/:id', async (req,res) =>{
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send("Invalid Category");
    try{
        const updatedProduct = await Product.updateOne({_id: req.params.id},{$set : {
            name:req.body.name,
            description:req.body.description,
            category:req.body.category,
            price:req.body.price,
            stock:req.body.stock
        }});
        res.status(500).send(updatedProduct);
    
    } catch(err) {
        res.send({message: err});
    }
});

//Delete product by Id
router.delete("/:id" , (req,res) => {
    Product.findByIdAndRemove(req.params.id)
    .then((product) => {
        if(product){
            return res.status(200).json({success: true, message :"product deleted"});
        }else{
            return res.status(404).json({success:false, message:"product not found"});
        }
    }).catch((err) => {
        return res.status(400).json({success:false, error: err});
    });
});







module.exports = router;
