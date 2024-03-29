import mongoose, { Schema } from "mongoose";
import User from './User.js'

const ProductSchema = new mongoose.Schema({
    
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    imgURL:{
        type:String,
        required: true,
    },

}, {
    timestamps: true,
});

ProductSchema.index({
    title: 'text',
    description:'text'
},{
    weights: {
        name: 5,
        description: 1
    }
})

export default mongoose.model('Product', ProductSchema);