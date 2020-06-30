'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

var showSchema = Schema({
    showname: {type: String, required: "This field is required."},
    director: {type: String, required: "This field is required."},
    showtime: {type: String, required: "This field is required."},
    showlocation: {type: String, required: "This field is required."},
    showdescription: {type: String, required: "This field is required."},
    showpicurl: {type: String, required: "This field is required."},
    availabletickets: {type: Number, required: "This field is required."},
    price: {type: Number, required: "This field is required."}
});

module.exports = mongoose.model( 'Show', showSchema, "showcollection");