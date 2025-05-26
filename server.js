const express = require('express') // Import Express library
const logger = require('morgan') // Import & set up Morgan for logging
const methodOverride = require('method-override') // Import Method Override - needed for forms 
const session = require('express-session') // Import Express Session for authentication 
require('dotenv').config() // To access the .env file 

const authRouter = require('./routes/authRouter.js') // Import Auth Router
const userRouter = require('./routes/userRouter.js') // Import User Router
const postRouter = require('./routes/postRouter.js') // Import Post Router
const tagRouter = require('./routes/tagRouter.js') // Import Tag Router

const PORT = process.env.PORT ? process.env.PORT : 3000 // Port on 3000

const db = require('./db') // To excute the connect function 

// After importing we must put them in use
const app = express()

app.set('view engine', 'ejs');

app.use(logger('dev'))
app.use(express.json()) // Parses incoming requests with JSON
app.use(express.urlencoded({ extended: false })) // Parses URL-encoded data from forms
app.use(methodOverride('_method'))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, // To make sure that the session object is only restored if modified
    saveUninitialized: true // To make sure that the session object is saved even if it contains no data
}))

app.use((req, res, next) => {
    res.locals.user = req.session.user
    next()
})

app.use('/auth', authRouter) // This tells the app to navigate to auth router when "http://localhost:3000/auth" is called 
app.use('/users', userRouter) // This tells the app to navigate to user router when "http://localhost:3000/users" is called 
app.use('/posts', postRouter) // This tells the app to navigate to post router when "http://localhost:3000/posts" is called 
app.use('/tags', tagRouter) // This tells the app to navigate to tag router when "http://localhost:3000/tags" is called 

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.listen(PORT, () => {
    console.log(`Running Server on Port ${PORT} . . . `)
})