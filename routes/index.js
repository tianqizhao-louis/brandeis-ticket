var express = require('express');
var router = express.Router();
const mongoose = require( 'mongoose' );
var theShow = require('../models/Show');
var show = mongoose.model('Show');

/* GET home page. */
router.get('/', function(req, res, next) {
  show.find((err, docs) => {
    if(!err){
      res.render('index', {
        title: 'Express',
        list: docs
      })
    }else{
      console.log('Error in retrieving show list: ' + err);
    }
  })
});

module.exports = router;
