'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

var showSchema = Schema({
    showname: String,
    director: String,
    showtime: String,
    showlocation: String,
    showdescription: String,
    showpicurl: String,
    availabletickets: Number
});

module.exports = mongoose.model( 'Show', showSchema, "showcollection");