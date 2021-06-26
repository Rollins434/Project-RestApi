const mongoose =  require("mongoose");

const productSchema = mongoose.Schema({
    name :{ type : String, required: true},
    description :{type:String, required: true},
    price: {type:Number , required:true},


    category:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    }],
    stock: {type:Number, required:true,min:0, max:20},
    dateCreated: {type: Date, default: Date.now}
})

exports.Product = mongoose.model("Product", productSchema);