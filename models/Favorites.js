import mongoose from "mongoose";

const FavoritesSchema = new mongoose.Schema({
    
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
}, {
    timestamps: true,
});

export default mongoose.model('Favorites', FavoritesSchema);