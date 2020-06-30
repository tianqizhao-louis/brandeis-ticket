var express = require('express');
var router = express.Router();
const Show = require('../models/Show');

router.get('/:id', (req, res) => {
    Show.findById(req.params.id, (err, doc) => {
        res.render('addToCart', {
            ind: doc,
            user: res.locals
        });
    });
});

module.exports = router;