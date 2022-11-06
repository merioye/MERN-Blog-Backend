const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    postId: {
        type: String,
        required: true
    },
    userImage: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    }
});



// collection
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;