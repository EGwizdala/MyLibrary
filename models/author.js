const mongoose = require('mongoose');
const Book = require('./book')

//creating a shema for authors

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})
 
// metoda działajaca przed zaladowaniem authorSchema - sprawedzenie czy author jest powiazany z book
authorSchema.pre("remove", function (next) {
    Book.find({ author: this.id }, (err, books) => {
        if (err) {
            next(err)
        } else if (books.length > 0) {
            next(new Error("this author has books still"))
        } else {
            next()
        }
    })
})
module.exports = mongoose.model("Author", authorSchema)