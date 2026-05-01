const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a category name'],
        unique: true,
        trim: true
    },
    image: {
        type: String,
        default: 'no-image.jpg'
    },
    cookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null // null means global/admin category
    },
    createdAt: {

        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Category', categorySchema);
