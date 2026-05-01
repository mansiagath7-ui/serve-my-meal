const mongoose = require('mongoose');

const cookProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    specialty: {
        type: String,
        required: [true, 'Please add a specialty']
    },
    experience: {
        type: String,
        required: [true, 'Please add experience years']
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviewsCount: {
        type: Number,
        default: 0
    },
    hourlyRate: {
        type: Number,
        required: true
    },
    bio: {
        type: String,
        maxlength: [500, 'Bio cannot be more than 500 characters']
    },
    cuisines: [String], // e.g. ["North Indian", "South Indian"]
    isVerified: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['online', 'offline'],
        default: 'offline'
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('CookProfile', cookProfileSchema);