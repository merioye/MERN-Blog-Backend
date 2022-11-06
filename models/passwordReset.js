const mongoose = require('mongoose');


const passwordResetSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token:{
        type: String,
        required: true
    }
}, {timestamps:true});


passwordResetSchema.index({'updatedAt': 1}, {expireAfterSeconds: 7200});

// creating collection
const PasswordReset = mongoose.model('PasswordReset', passwordResetSchema);

module.exports = PasswordReset;