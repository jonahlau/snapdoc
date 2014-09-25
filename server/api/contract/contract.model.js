'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    TreeSchema = require('../tree/tree.model').Tree;

var ContractSchema = new Schema({
  tree: { type: Schema.Types.ObjectId, ref: "Tree"},
  answers: {}
});

module.exports = mongoose.model('Contract', ContractSchema);
