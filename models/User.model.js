// User model here
const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const userSchema = new Schema({
    username: {
        type: String,
        trim: true,
        required: [true, 'Username is required'],
        unique: true
    },
    password: {
        type: String,
        require: [true, 'Pass is required']
    }
})

module.exports = model('User', userSchema);