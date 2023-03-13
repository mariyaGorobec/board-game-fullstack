import mongoose, { Schema } from "mongoose";


const OrderSchema = new mongoose.Schema({
        user: {
            type: Object,
            defult: {}
        },
        products: {
            type: Array,
            defult: []
        },
        totalPrice:{
            type: String
        }
},{
    timestamps: true,
})

export default mongoose.model('Order', OrderSchema);