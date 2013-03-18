"use strict";

var domain = require('domain');
var oldDomain = domain.Domain;
var uuid = require('node-uuid').v4;
var HttpIncomingMessage = require('http').IncomingMessage;


function created(d) {
  process.nextTick(function() {
    if (! d._id) d._id = uuid();
  });
}

function addedEmitter(d, ee) {
  var id;
  if (! d._id)
    if ((ee instanceof HttpIncomingMessage) &&
        ee.client &&
        ee.client.server &&
        (id = ee.headers['x-domain-id'])) {
      d._id = id;
    }
}

var Domain =
domain.Domain =
function DomainPatched() {
  oldDomain.apply(this, arguments);
  created(this);
};

Domain.prototype = oldDomain.prototype;

domain.create =
domain.createDomain =
function createDomain(cb) {
  return new Domain(cb);
};

var oldAdd = Domain.prototype.add;
Domain.prototype.add =
function add(ee) {
  oldAdd.apply(this, arguments);
  addedEmitter(this, ee);
};