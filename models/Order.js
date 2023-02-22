import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    boardGame: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BoardGame',
        required: true,
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    }
}, {
    timestamps: true,
});

export default mongoose.model('Order', OrderSchema);