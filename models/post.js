const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    category:{
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    desc:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    postImage:{
        type: String,
        required: true,
        trim: true
    },
    author:{
        type: String,
        required: true
    },
    authorImage:{
        type: String,
        required: true
    }
}, {timestamps:true});



// creating collection
const Post = mongoose.model('post', postSchema);

module.exports = Post;