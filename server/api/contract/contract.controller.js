'use strict';

var _ = require('lodash');
var Contract = require('./contract.model');

// Get list of contracts
exports.index = function(req, res) {
  Contract.find(function (err, contracts) {
    if(err) { return handleError(res, err); }
    return res.json(200, contracts);
  });
};

// Get a single contract
exports.show = function(req, res) {
  Contract.findById(req.params.id, function (err, contract) {
    if(err) { return handleError(res, err); }
    if(!contract) { return res.send(404); }
    return res.json(contract);
  });
};

// Creates a new contract in the DB.
exports.create = function(req, res) {
  var userId = req.user._id;
  req.body.userId = userId;
  Contract.create(req.body, function(err, contract) {
    if(err) { return handleError(res, err); }
    return res.json(201, contract);
  });
};

// Updates an existing contract in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Contract.findById(req.params.id, function (err, contract) {
    if (err) { return handleError(res, err); }
    if(!contract) { return res.send(404); }
    var updated = _.merge(contract, req.body);
    console.log(updated,req.body)
    updated.markModified('answers');
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, contract);
    });
  });
};

// exports.answer = function(req,res,next) {
//   Contract.findById(req.params.id, function (err, contract) {
//     if(err) return handleError(res,err);
//     contract.answerss
//   });
// }

// Deletes a contract from the DB.
exports.destroy = function(req, res) {
  Contract.findById(req.params.id, function (err, contract) {
    if(err) { return handleError(res, err); }
    if(!contract) { return res.send(404); }
    contract.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}