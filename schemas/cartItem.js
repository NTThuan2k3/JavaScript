let mongoose = require('mongoose');

let cartItemSchema = new mongoose.Schema({
    cart:{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'cart', 
        required: true 
    },
    product:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'product' 
    },
    quantity:{ 
        type: Number, 
        default: 1 
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

module.exports = mongoose.model('cartItem',cartItemSchema)