"use strict";

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const layouts = require("express-ejs-layouts");
const auth = require('./config/auth.js');
const bodyParser = require('body-parser');

//Created mongolab-amorphous-35976 as MONGODB_URI
const mongoose = require( 'mongoose' );
//mongoose.connect( `mongodb+srv://${auth.atlasAuth.username}:${auth.atlasAuth.password}@cluster0-yjamu.mongodb.net/authdemo?retryWrites=true&w=majority`);
//mongoose.connect( 'mongodb://admin:mypwd@localhost:27017/ticketing', {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false});
mongoose.connect( 'mongodb://localhost:27017/ticketing', {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false});
//const mongoDB_URI = process.env.MONGODB_URI .
//mongoose.connect(mongoDB_URI)m
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("we are connected!!!")
});

const authRouter = require('./routes/authentication');
const isLoggedIn = authRouter.isLoggedIn;
const AdminDB = require("./models/Admin");
const loggingRouter = require('./routes/logging');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const dbRouter = require('./routes/db');
const toDoRouter = require('./routes/todo');
const toDoAjaxRouter = require('./routes/todoAjax');
const showRouter = require('./routes/showAdding');
const Show = require('./models/Show');
//const cartRouter = require('./routes/cart');
var theUser = mongoose.model('User');


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(layouts);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(authRouter)
app.use(loggingRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/db',dbRouter);
app.use('/dbdemo',
    (req,res) => res.render('dbdemo'))

app.use('/todo',toDoRouter);
app.use('/todoAjax',toDoAjaxRouter);
app.use('/addShow', showRouter);
app.get('/addShow', (req, res) => {
    res.render('addShow');
});
app.get('/updateShow', (req, res) => {
    Show.find((err, docs) => {
        if(!err){
            res.render('updateShow', {
                list: docs
            })
        }else{
            console.log('Error in retrieving show list: ' + err);
        }
    });
});

app.get('/individualShow/:id', (req, res) => {
    Show.findById(req.params.id, (err, doc) => {
        res.render('individualShow', {
            individualShow: doc
        })
    });
});

//app.use('/addToCart', cartRouter);
app.get('/yeah', (req, res) => {
    res.render('yeah');
});

app.get('/addToCart/:id', (req, res) => {
    var user = req.user;
    Show.findById(req.params.id, (err, doc) => {
        res.render('addToCart', {
            ind: doc,
            user: user
        });
    });
});

app.post('/addToCart/add', (req, res, next) => {
    var numTickets = req.body.numberOfTickets;
    numTickets = -Math.abs(numTickets);
    Show.findOneAndUpdate({_id: req.body.showID}, {
        $inc: {availabletickets: numTickets}
    }, {new : true}, (err, doc) => {
        if(!err){
        }else{
            console.log(err);
        }
    });
    console.log(req.body.userID);
    theUser.findOneAndUpdate({_id: req.body.userID}, {
        $push: {cart: [req.body.showName]}
    }, {new : true}, (err, doc) => {
        if(!err){

        }else{
            console.log(err);
        }
    });
    theUser.findOneAndUpdate({_id: req.body.userID}, {
        $push: {cartNumber: [req.body.numberOfTickets]}
    }, {new : true}, (err, doc) => {
        if(!err){
            res.redirect('/');
        }else{
            console.log(err);
        }
    });
    console.log("updated available tickets and added to cart");
});

app.get('/profiles',
    isLoggedIn,
    async (req,res,next) => {
        try {
            res.locals.profiles = await User.find({})
            res.render('profiles')
        }
        catch(e){
            next(e)
        }
    }
)
app.use('/publicprofile/:userId',
    async (req,res,next) => {
        try {
            let userId = req.params.userId
            res.locals.profile = await User.findOne({_id:userId})
            res.render('publicprofile')
        }
        catch(e){
            console.log("Error in /profile/userId:")
            next(e)
        }
    }
)


app.get('/profile',
    isLoggedIn,
    (req,res) => {
        res.render('profile');
    });


app.get('/editProfile',
    isLoggedIn,
    (req,res) => res.render('editProfile'))

app.post('/editProfile',
    isLoggedIn,
    async (req,res,next) => {
        try {
            let username = req.body.username
            let age = req.body.age
            req.user.username = username
            req.user.age = age
            req.user.imageURL = req.body.imageURL
            await req.user.save()
            res.redirect('/profile')
        } catch (error) {
            next(error)
        }

    })


app.use('/data',(req,res) => {
    res.json([{a:1,b:2},{a:5,b:3}]);
})

const User = require('./models/User');

app.get("/test",async (req,res,next) => {
    try{
        const u = await User.find({})
        console.log("found u "+u)
    }catch(e){
        next(e)
    }

})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.set("port", process.env.PORT || 3000);

const server = app.listen(app.get("port"), () => {
    console.log(`Server running at http://localhost:${app.get("port")}`);
  }),
  io = require("socket.io")(server);

module.exports = app;