var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
var theShow = require('../models/Show');
var show = mongoose.model('Show');

router.get('/', (req, res, next) => {
   res.render('addShow', {
       updateShow: req.body
   });
});

router.post('/', (req, res, next) => {
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
    newShow.price = req.body.price;

    newShow.save((err, doc) => {
        if(!err){
            res.redirect('/')
        }else{
            if (err.name == 'ValidationError'){
                handleValidationError(err, req.body);
                res.render('addShow', {
                    updateShow: req.body
                });
            }else{
                console.log('Error during record insertion: ' + err);
            }
        }
    });
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

function handleValidationError(err, body) {
    for (const field in err.errors) {
        switch (err.errors[field].path) {
            case 'showname':
                body['shownameError'] = err.errors[field].message;
                break;
            case 'director':
                body['directorError'] = err.errors[field].message;
                break;
            case 'showtime':
                body['showtimeError'] = err.errors[field].message;
                break;
            case 'showlocation':
                body['showlocationError'] = err.errors[field].message;
                break;
            case 'showdescription':
                body['showdescriptionError'] = err.errors[field].message;
                break;
            case 'showpicurl':
                body['showpicurlError'] = err.errors[field].message;
                break;
            case 'availabletickets':
                body['availableticketsError'] = err.errors[field].message;
                break;
            case 'price':
                body['priceError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    show.findById(req.params.id, (err, doc) => {
        res.render('addShow', {
            updateShow: doc
        })
    });
});

router.get('/delete/:id', (req, res) => {
    show.findByIdAndRemove(req.params.id, (err, doc) => {
        if(!err){
            res.redirect('/');
        }else{
            console.log('Error in show deletion: ' + err);
        }
    });
});

module.exports = router;