import mongoose from "mongoose";


const flashCardSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    deckId: String,
    uId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    isReviewed: {
        type: Boolean,
        default: false
    },
    lastReviewed: {
        type: Date,
        default: null
    },
    question : {
        type: String,
        required: true
    },
    answer : {
        type: String,
        required: true
    },
    tags : [String],
},
    { timestamps: true} // Automatically adds createdAt and updatedAt fields
)

export const flashCard = mongoose.models.flashCard ||  mongoose.model('flashCard', flashCardSchema);