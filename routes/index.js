var express = require('express');
var router = express.Router();
const mongoose = require( 'mongoose' );
var theShow = require('../models/Show');
var show = mongoose.model('Show');
var AdminDB = mongoose.model('AdminDB');

/* GET home page. */
router.get('/', function(req, res, next) {
  let ifFindUser;
  if(req.user == undefined){
  }else{
    console.log(req.user.googleemail);
    var user = req.user;
    ifFindUser = AdminDB.findOne({googleemail : user.googleemail});
    console.log(ifFindUser);
  }


  show.find((err, docs) => {
    if(!err){
      res.render('index', {
        title: 'Express',
        list: docs,
        ifFindUser : ifFindUser
      })
    }else{
      console.log('Error in retrieving show list: ' + err);
    }
  })
});

module.exports = router;
