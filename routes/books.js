const express = require('express');
const author = require('../models/author');
const router = express.Router();
//path - biblioteka node.js, The path module provides utilities for working with file and directory paths. It can be accessed using
// const path = require('path')
//fs - biblioteka node opowiedzalna za file sytem
// const fs = require('fs')

//przywołanie dostępu do schematów dla autora i ksiazek
const Book = require("../models/book"); 
const Author = require("../models/author");
// const multer = require('multer');
const { error } = require('console');
// const uploadPath = path.join("public", Book.coverImageBasePath); 

const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"];
// path.join - polaczy dwie rozne sciezki

// const upload = multer({
//     dest: uploadPath,
//     //fileFilter przesiewa pliki jakie chcemy wczytac
//     fileFilter: (req, file, callback) => {
//         callback(null, imageMimeTypes.includes(file.mimetype))
//     }
// })

//All books route
router.get("/", async (req, res) => {
    let query =  Book.find();

    const before = req.query.publishedBefore;
    const after = req.query.publishedAfter;
    console.log(before, after)
 

    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
      }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
          //lte - larger than
        query = query.lte('publishDate', req.query.publishedBefore)
    }
        // gte -grather than
      if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.gte('publishDate', req.query.publishedAfter)
      }   
    try {
        const books = await query.exec()
       
        res.render("books/index", {
            books: books,
            searchOptions: req.query,
        })
    } catch (err) {
        console.log(err.message)
        res.redirect("/")
        
    }
  
   
   
})


//New Book route
router.get("/new", async(req, res) => {
    renderNewPage(res, new Book())
}) 

//Create book route
// upload.single("cover") - nie jest potrzebne przy uzywaniu filepond i plikow zakdowanych w string
// router.post('/', upload.single("cover"), async (req, res) => {

router.post('/', async (req, res) => {
    // const fileName = req.file != null ? req.file.filename : null;
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
    //publishDate is a string - new Date object changes it to strimg
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description,
        // coverImageName: fileName,
    }) 
    console.log( book)
    saveCover(book, req.body.cover)
    try {
        console.log("udalo sie");
        console.log(`to jest book w try ${book.publishDate}`)
        const newBook = await book.save();
        //res.redirect(`books/${newBook.id}`);
        res.redirect(`books`);
        
    } catch(err) {
        console.log(err.message)
        // if (book.coverImageName != null) {
        //     removeBookCover(book.coverImageName)
        // }
        renderNewPage(res, book, true)
    } 
})

// function removeBookCover(fileName) {
//     fs.unlink(path.join(uploadPath, fileName), err => {
//         if(err) console.err(err.message)
//     })
// }
 
async function renderNewPage(res, book, hasError = false ) {
    try {
        const authors = await Author.find({});
        // params aby wyświetlać dynamicznie bład
        const params = {
            authors: authors,
            book: book
        }
        if (hasError) {
            console.error(err.message);
            params.errorMessage = "Error Creating Book";
        }
        res.render("books/new", params)
    } catch {
        res.redirect(`books`);

    }
}

function saveCover(book, coverEncoded) {
    if (coverEncoded == null) return console.error
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data, "base64")
        book.coverImageType = cover.type
    }
}

module.exports = router


//library multer - biblioteka do zarządzania plikami - Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files. It is written on top of busboy for maximum efficiency.