const mongoose = require('mongoose');
const path  = require('path')
const coverImageBasePath = "uploads/bookCovers"

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    publishDate: {
        type: Date,
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    coverImageName: {
        type: String,
        required: false
    },
    author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
        ref: "Author"
    },
})

// funkcja virtual w mongoos pozwala na stworzenie wirtualnej wlasciwosci/zmiennej. Uzyta jest funkcja normalna, bo potrzebne jest dziedziczenie po this
bookSchema.virtual("coverImagePath").get(function () {
    if (this.coverImageName != null) {
        console.log(this.coverImageName);
        return path.join("/", coverImageBasePath, this.coverImageName)
    }
})

module.exports = mongoose.model("Book", bookSchema);
// module.exports.coverImageBasePath  - exprotuje jako zmienna coverImageBasePath 
module.exports.coverImageBasePath = coverImageBasePath;