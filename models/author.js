const mongoose = require('mongoose');

//creating a shema for authors

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Author", authorSchema)