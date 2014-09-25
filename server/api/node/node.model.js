'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ConnectionSchema = new Schema({
  option: String,
  type: String, // could be 'fill in the blank',
  next: { type: Schema.Types.ObjectId, ref: "Node" }
});

//.parent on any connection can send you to the parent

ConnectionSchema.methods.match = function(answer) {
  if(this.type === 'otherwise') return true;
  return answer === this.option;
};

// ConnectionSchema.methods.parent = function() {
//   return this.__parent;
// }

var NodeSchema = new Schema({
  num: Number,
  name: String,
  question: String,
  connections: [ConnectionSchema]
});

NodeSchema.methods.match = function(answer) {
  //loop through connections and call their match
  for(var i = 0; i < this.connections.length; i++) {
    if(this.connections[i].match(answer)) {
      return this.connections[i];
    }
  }
};

NodeSchema.methods.connect = function(option, type, node, cb) {
  this.connections.push({
    option: option,
    type: type,
    next: node._id
  });
  this.save(cb);
};

/*
  var node1 = ...
  var node2 = ...
  var node3 = ...

  node1.connect("yes","normal",node2)
  node1.connect("no","normal",node3,function() {
    //optional callback...
  })

*/




module.exports = mongoose.model('Node', NodeSchema);