let mongoose = require('mongoose');

let cartSchema = mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:'user',
        required:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    slug:String
},{
    timestamps:true
})

module.exports = mongoose.model('cart',cartSchema)
