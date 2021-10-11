const express = require('express');
const router = express.Router();
const Book = require('../models/book')

router.get("/", async (req, res) => {
    let books
    try {
        //sortowanie ksiazek po dacie zmiejszajaco z limitem 10 ksiazek i exec - czyli wywolanie - 
        //The exec() method tests for a match in a string.
        //This method returns the matched text if it finds a match, otherwise it returns null.
        books = await Book.find().sort({createdAt: "desc"}).limit(10).exec()
    } catch (error) {
        books = []
        
    }
    res.render("index", {books: books}) 
}) 

module.exports = router 