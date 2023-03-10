import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    
        name: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    patronymic: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    addressShipping:{
        type: String,
        required: true,
    },
    localityShipping:{
        type: String,
        required: true,
    },
    
    postcode:{
        type: String,
        required: true,
    },

    passwordHash:{
        type: String,
        required: true,
    },
    role: {
        type: Boolean,
        require: true,
        default: false
    },
    cart:{
        type: Array,
        defult: []
    },
    favorites:{
        type: Array,
        defult: []
    },
    orders: {
        type: Array,
        defult: []
    }

}, {
    timestamps: true,
});

export default mongoose.model('User', UserSchema);