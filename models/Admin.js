'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var adminSchema = Schema( {
    googleemail: String
} );

module.exports = mongoose.model('AdminDB', adminSchema, "admincollection");