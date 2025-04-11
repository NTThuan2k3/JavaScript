let mongoose = require('mongoose');

let orderSchema = new mongoose.Schema({
    user:{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user' 
    },
    items:[{
        product:{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'product' 
        },
        quantity: Number
    }],
    totalAmount:{
        type:Number,
        min:0
    },
    status:{ 
        type: String, 
        default: 'Đang chờ xử lý' 
    },
    shippingAddress:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,
        required:true
    },
    method:{ 
        type: String, 
        default: 'cash' 
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    slug:String
},
{
    timestamps:true
})
module.exports = mongoose.model('order',orderSchema)
