const express = require('express');
const app = express () ;
const morgan = require('morgan');
const mongoose = require('mongoose')
require('dotenv').config();
const pinRoutes = require('./api/routes/pin')
const userRoutes= require('./api/routes/user')

app.use(morgan('dev'));
app.use(express.json())





const URI = process.env.MONGODB_URL
mongoose.connect(URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if(err) throw err;
    console.log("Connected to mongodb")
})


// Routes

app.use('/pin',pinRoutes)
app.use('/user',userRoutes)

app.use((req,res,next)=>{
    const error = new Error(' Not found')
    error.status=404;
    next(error)
})

app.use((error,req,res,next)=>{
    res.status(error.status || 500)
    res.json({
        error:{
            msg:error.message
        }
    })
})

module.exports=app;