//access one specific variable, access it like any property of an object:
// console.log('The value of PORT is:', process.env.PORT);
//if checks if app is in production
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
  
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const methodOverride = require('method-override')

const indexRouter = require('./routes/index'); 
const authorRouter = require('./routes/authors');
const bookRouter = require('./routes/books');
 
app.set('view engine', "ejs");
app.set("views", __dirname + '/views');
app.set('layout', "layouts/layout");
app.use(expressLayouts);
app.use(methodOverride('_method'))
app.use(express.static('public'));
//telling express how to use bodyParser 10mb zwięszanie przepływu danych
app.use(bodyParser.urlencoded({limit:"10mb", extended: false}))
  
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })

const db = mongoose.connection
db.on("error", error => console.error(error))
db.once("open", () => console.log("conected to mongoose"))

db.on('open', function (ref) {
    console.log('Connected to mongo server.');
    //trying to get collection names
    mongoose.connection.db.listCollections().toArray(function (err, names) {
        console.log(names); // [{ name: 'dbname.myCollection' }]
        module.exports.Collection = names;
    });
})


app.use('/', indexRouter)
app.use('/authors', authorRouter)
app.use('/books', bookRouter)



app.listen(process.env.PORT || 3000)

