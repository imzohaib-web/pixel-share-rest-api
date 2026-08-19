const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    image: {
        type: String,
        required: [true, 'Image URL is required']
    },
    fileId: {
        type: String,
        default: null
    },
    caption: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const postModel = mongoose.model('post', postSchema);

module.exports = postModel;