import mongoose from "mongoose";

const BoardGameSchema = new mongoose.Schema({
    
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
    gameImgUrl:{
        type:String,
        required: true,
    },

}, {
    timestamps: true,
});

export default mongoose.model('BoardGame', BoardGameSchema);