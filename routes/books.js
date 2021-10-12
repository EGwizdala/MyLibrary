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


// const deleteAllData = async () => {
//     try {
//       await Book.deleteMany();
//       console.log('All Data successfully deleted');
//     } catch (err) {
//       console.log(err);
//     }
// };
// deleteAllData()
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
        res.redirect(`books/${newBook.id}`);
      
        
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

//Show book route
router.get('/:id', async (req, res) => {
    try {
        //populate - lets you reference documents in other collections.
        const book = await Book.findById(req.params.id).populate("author").exec()
        res.render('books/show', {book: book})
    } catch (err) {
        console.log(err)
        res.redirect("/")
    }
})

//Edit book route
router.get('/:id/edit', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
       renderEditPage(res, book)
    } catch (err) {
        cosnole.log(err)
        res.redirect("/")
    }
})


//Update book route
router.put('/:id', async (req, res) => {
    let book 
    try {
        book = await Book.findById(req.params.id)
        book.title = req.body.title
        book.author = req.body.author
        book.publishDate = new Date(req.body.publishDate)
        book.pageCount = req.body.pageCount
        book.description = req.body.description
       
        if (req.body.cover != null && req.body.cover !== "") {
            saveCover(book, req.body.cover)
        }
        console.log(book.id)
        await book.save()
        res.redirect(`/books/${book.id}`)
        
    } catch (err) {
        if (book != null) {
            renderEditPage(res, book, true)
            console.log(err.message)
        } else {
            res.redirect("/")
            console.log(err.message)
        }
    } 
})

//Delete book route
router.delete("/:id", async (req, res) => {
    let book
    try {
        book = await Book.findById(req.params.id)
        await book.remove()
        res.redirect("/books")
    } catch (error) {
        if (book != null) {
            res.render("books/show", {
                book: book,
                errorMessage: "Could not remove book"
            })
        } else {
            res.redirect("/")
            console.log(error.message)
        }
    }
})



async function renderNewPage(res, book, hasError = false ) {
    renderFormPage(res, book, "new", hasError ) 
}

async function renderEditPage(res, book, hasError = false ) {
    renderFormPage(res, book, "edit", hasError)
}
async function renderFormPage(res, book, form, hasError = false ) {
    try {
        const authors = await Author.find({});
        // params aby wyświetlać dynamicznie bład
        const params = {
            authors: authors,
            book: book
        }
        if (hasError) {
            if (form === "edit") {
                console.error(err.message);
                params.errorMessage = "Error Updating Book"; 
            } else {
                console.error(err.message);
                params.errorMessage = "Error Creating Book"; 
            }
        }
        res.render(`books/${form}`, params)
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