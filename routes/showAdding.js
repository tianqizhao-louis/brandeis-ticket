var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
var theShow = require('../models/Show');
var show = mongoose.model('Show');

router.get('/addShow', (req, res, next) => {
   res.render('addShow');
});

router.post('/addShow', (req, res, next) => {
   if(req.body._id == ''){
       insertRecord(req, res);
   } else{
       updateRecord(req, res);
   }
});

function insertRecord(req, res){
    var newShow = new show();
    newShow.showname = req.body.showname;
    newShow.director = req.body.director;
    newShow.showtime = req.body.showtime;
    newShow.showlocation = req.body.showlocation;
    newShow.showdescription = req.body.showdescription;
    newShow.showpicurl = req.body.showpicurl;
    newShow.availabletickets = req.body.availabletickets;

    newShow.save();
    res.redirect('/');
}

function updateRecord(req, res) {
    show.findOneAndUpdate({
        _id: req.body._id
    }, req.body, {new : true}, (err, doc) => {
        if(!err){
            res.redirect('/');
        }else{
            console.log(err);
        }
    })
}

module.exports = router;