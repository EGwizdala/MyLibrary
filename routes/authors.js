const express = require('express');
const router = express.Router();
//przywołanie dostępu do schematów dla autora
const Author = require("../models/author")
//All authors route
router.get("/", (req, res) => {
    res.render("authors/index")
}) 

//New author route
router.get("/new", (req, res) => {
    // w {} przekazane zmienne z serwera 
    res.render("authors/new", {author: new Author()} )
})

//Create author route
router.post("/", async (req, res) => {
    //tworzymy nowego autora 
    const author = new Author({
        name: req.body.name 
    })
    
    //zapsywanie danych w postaci callback
    author.save((err, newAuthor) => {
        if (err) {
            res.render('authors/new', {
                author: author,
                errorMessage: "Error creating Author"
                
            })
        } else {
            // res.redirect(`authors/${newAuthor}`)
            res.redirect(`authors`)
        }
        
    }) 
    //req.body - ciało formularza przesłane do serwera name - dane podana przez formularz
//     res.send(req.body.name)
})

module.exports = router