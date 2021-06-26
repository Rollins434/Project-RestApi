const {Category} = require("../models/category");
const express= require("express");
const router= express.Router();
const mongoose = require("mongoose");
const slugify = require('slugify');




function createCategories(categories,parentId = null){
    const categoryList = [];
    let category;
    if(parentId == null){
        category = categories.filter(c => c.parentId == undefined);
    }else{
        category = categories.filter(c => c.parentId == parentId);
    }

    for(let cat of category){
        categoryList.push({
            _id: cat._id,
            name: cat.name,
            slug: cat.slug,
            children: createCategories(categories, cat._id)
        });
    }

    return categoryList;

}
// Get all categories
router.get(`/`, async(req,res) => {
    // const categoryList= await Category.find();

    // if(!categoryList){
    //     res.status(500).json({success : false});
    // }
    // res.send(categoryList);
    Category.find({})
    .exec((error,categories) =>{
        if(error) return res.status(400).json({error});

        if(categories){
            const cList = createCategories(categories);
             res.status(200).json({cList});
        }
    })

});




// Post category
router.post(`/` ,  (req,res) => {

    const category = {
        name:req.body.name,
        slug: slugify(req.body.name)
    }
    
    if(req.body.parentId){
        category.parentId = req.body.parentId
    }
    
    const cat = new Category(category);
    cat.save((err,category)=>{
        if(err) return res.status(400).json({err});
        if(category){
            return res.status(201).json({category});
        }
    });
    // let category = new Category({
    //     name: req.body.name
    // });
    // category = await category.save();

    // if(!category) return res.status(404).send("category cannot be created");

    // res.status(200).send(category);
})

// Find category by individual id
router.get("/:id", async(req,res) =>{
    const category = await Category.findById(req.params.id);

    if(!category){
        res.status(500).json({message:"category with given id not found"});
    }
    res.status(200).send(category);
})

// Update Category
// router.put("/:id", async (req,res) => {
//     const category = await Category.findOneAndUpdate(
//         req.params.id ,{
//             name: req.body.name

//         }
//         )
//         if(!category) return res.status(400).json({message:"category cannot be updated"});

//         res.status(200).send(Category);
        
// });
// Update category
router.put("/:id", async (req,res) =>{
    try{
     const updatedCategory = await Category.updateOne({_id: req.params.id},{$set: {name: req.body.name}});
     res.json(updatedCategory);
    }catch (err){
        res.json({message: err});
    }
});




//Delete category by Id
router.delete("/:id" , (req,res) => {
    Category.findByIdAndRemove(req.params.id)
    .then((category) => {
        if(category){
            return res.status(200).json({success: true, message :"category deleted"});
        }else{
            return res.status(404).json({success:false, message:"category not found"});
        }
    }).catch((err) => {
        return res.status(400).json({success:false, error: err});
    });
});


module.exports = router;