let mongoose = require('mongoose');

let paymentSchema = new mongoose.Schema({
    order:{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'order' 
    },
    method:{ 
        type: String, 
        default: 'cash' 
    },
    status:{ 
        type: String, 
        default: 'Đang chờ xử lý' 
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    slug:String
},{
    timestamps:true
})
module.exports = mongoose.model('payment',paymentSchema)
