const express = require('express');
const author = require('../models/author');
const router = express.Router();
//przywołanie dostępu do schematów dla autora
const Author = require("../models/author")

//All authors route
router.get("/",  async(req, res) => {
    try {
        //szukanie na obiekcie author z mongoose, pusty oznacza, ze bez warunkow 
        
        const authors = await Author.find({});
       
       
        res.render("authors/index", {authors: authors})
    } catch {
         res.redirect("/")
    } 
})




//New author route
router.get("/new", (req, res) => {
    // w {} przekazane zmienne z serwera 
    
    res.render("authors/new", { author: new Author() })
    console.log(author);
}) 

//Create author route
router.post('/', async (req, res) => {
   
    // res.send("create")
    const author = new Author({
      name: req.body.name
    })
    try {
        const newAuthor = await author.save()
        
        res.redirect(`authors`)
        console.log(author.name)
    //   res.redirect(`authors/${newAuthor.id}`)
    } catch {
      res.render('authors/new', {
        author: author,
        errorMessage: 'Error creating Author'
      })
    }
//   
    //zapsywanie danych w postaci callback
    // author.save((err, newAuthor) => {
    //     if (err) {
    //         res.render('authors/new', {
    //             author: author,
    //             errorMessage: "Error creating Author"
    //         })
    //     } else {
    //         // res.redirect(`authors/${newAuthor}`)
    //         res.redirect(`authors`)
    //     }   
    // }) 
    //req.body - ciało formularza przesłane do serwera name - dane podana przez formularz
//     res.send(req.body.name)
})
module.exports = router