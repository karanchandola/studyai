import mongoose from "mongoose";


const deckSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    uId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    name : {
        type: String,
        required: true,
        unique: true
    },
    description : {
        type: String,
        default: null
    },
    createdAt : {
        type: Date,
        default: Date.now
    },
    updatedAt : {
        type: Date,
        default: Date.now
    },
},
{ autoIndex: true }
)



export const deck = mongoose.models.deck ||  mongoose.model('deck', deckSchema)