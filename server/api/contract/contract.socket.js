/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Contract = require('./contract.model');

exports.register = function(socket) {
  Contract.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Contract.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('contract:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('contract:remove', doc);
}