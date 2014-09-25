/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Node = require('./node.model');

exports.register = function(socket) {
  Node.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Node.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('node:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('node:remove', doc);
}