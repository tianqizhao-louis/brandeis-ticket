var express = require('express');
var router = express.Router();
const mongoose = require( 'mongoose' );
var theShow = require('../models/Show');
var Show = mongoose.model('Show');



router.get('/:id', (req, res) => {
    var user = req.user;
    Show.findById(req.params.id, (err, doc) => {
        res.render('addToCart', {
            ind: doc,
            user: user
        });
    });
});

router.post('/add', (req, res, next) => {
    var numTickets = req.body.numberOfTickets;
    numTickets = -Math.abs(numTickets);
    Show.findOneAndUpdate({_id: req.body.showID}, {
        $inc: {availabletickets: numTickets}
    }, {new : true}, (err, doc) => {
        if(!err){
            res.redirect('/');
        }else{
            console.log(err);
        }
    });
    console.log(req.body.userID);
    theUser.findOneAndUpdate({_id: req.body.userID}, {
        $push: {cart: [req.body.showID]}
    }, {new : true}, (err, doc) => {
        if(!err){
            res.redirect('/');
        }else{
            console.log(err);
        }
    });
    console.log("updated available tickets and added to cart");
});

module.exports = router;