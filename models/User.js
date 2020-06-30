'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

//var userSchema = mongoose.Schema( {any:{}})

var userSchema = Schema({
    googleid: String,
    googletoken: String,
    googlename:String,
    googleemail:String,
    cart: [String],
    cartNumber:[Number]
});

module.exports = mongoose.model( 'User', userSchema, "userCollection");