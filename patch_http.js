"use strict";

var domain = require('domain');
var http = require('http');
var uuid = require('node-uuid').v4;


function addRequest(req) {
  var d;
  var id;

  if (d = domain.active) {
    if (!d._id) id = d._id = uuid();
    req.setHeader('X-Domain-Id', id);
  }
}

var oldHttpRequest = http.request;
http.request =
function requestPatched() {
  var req = oldHttpRequest.apply(http, arguments);
  addRequest(req);
  return req;
};

var oldHttpClientRequest =
http.ClientRequest;

var HttpClientRequest =
http.ClientRequest =
function ClientRequestPatched() {
  var ret = oldHttpClientRequest.apply(this, arguments);
  addRequest(this);
  return ret;
};

require('util').inherits(HttpClientRequest, oldHttpClientRequest);

HttpClientRequest.__baseClass =
oldHttpClientRequest.__baseClass || oldHttpClientRequest;