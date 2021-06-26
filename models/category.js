const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        required:true,
        unique:true
    },
    parentId:{
        type:String
    }
})

   

exports.Category = mongoose.model("Category", categorySchema);


    //products: [{type:mongoose.Types.ObjectId, ref:'Product'}],