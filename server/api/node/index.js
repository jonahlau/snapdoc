'use strict';

var express = require('express');
var controller = require('./node.controller');

var router = express.Router();

router.get('/getnext/:id', controller.getNext);
router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;