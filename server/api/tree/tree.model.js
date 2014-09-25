'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Node = require('../node/node.model').Node;

var TreeSchema = new Schema({
  name: String,
  head : {type: Schema.Types.ObjectId, ref: "Node"},
  template: String,
});

module.exports = mongoose.model('Tree', TreeSchema);
