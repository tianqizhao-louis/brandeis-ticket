var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
var theShow = require('../models/Show');
var show = mongoose.model('Show');
var theUser = mongoose.model('User');

router.get('/:id', (req, res) => {
    show.findById(req.params.id, (err, doc) => {
        res.render('addToCart', {
            ind: doc,
            user: res.locals
        });
    });
});

router.post('/add', (req, res, next) => {
    console.log(req.body.showID);
    var numTickets = req.body.numberOfTickets;
    numTickets = -Math.abs(numTickets);
    show.findOneAndUpdate({_id: req.body.showID}, {
        $inc: {availabletickets: numTickets}
    }, {new : true}, (err, doc) => {
        if(!err){
            res.redirect('/');
        }else{
            console.log(err);
        }
    });
    theUser.findOneAndUpdate({_id: req.body.userID}, {
        $addToSet: {cart: [req.body.showID]}
    }, {new : true}, (err, doc => {
        if(!err){
            res.redirect('/');
        }else{
            console.log(err);
        }
    }))
    console.log("updated available tickets and added to cart");
});

module.exports = router;