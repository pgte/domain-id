var test = require('tap').test;
var domain_id = require('..');
var domain = require('domain');
var http = require('http');

function randomPort() {
  return Math.ceil(Math.random() * 8000) + 1024;
}

test('automatically assigns an id to a domain when one is created', function(t) {
  t.plan(1);

  var d = domain.create();

  process.nextTick(function() {
    t.type(d._id, 'string');
  });
});

test('assign id to domain after a headerless request is added', function(t) {

  t.plan(1);

  var server = http.createServer();
  var port = randomPort();

  server.once('request', function(req, res) {
    req.resume();
    var d = domain.create();
    d.add(req);
    d.add(res);
    res.end();
    server.close();
    process.nextTick(function() {
      t.type(d._id, 'string');
    });
  });

  server.listen(port);

  server.once('listening', function() {
    http.get('http://localhost:' + port, function(res) {
      res.resume();
    });
  });
});

test('delegate id from request to domain', function(t) {

  t.plan(1);

  var server = http.createServer();
  var port = randomPort();

  server.once('request', function(req, res) {
    req.resume();
    var d = domain.create();
    d.add(req);
    d.add(res);
    res.end();
    server.close();
    process.nextTick(function() {
      t.equal(d._id, 'ABCDEF');
    });
  });

  server.listen(port);

  server.once('listening', function() {
    var options = {
      hostname: 'localhost',
      port: port,
      headers: {
        'X-Domain-Id': 'ABCDEF'
      }
    };
    http.get(options, function(res) {
      res.resume();
    });
  });
});

test('delegate id from domain to request', function(t) {

  t.plan(2);

  var server = http.createServer();
  var port = randomPort();

  server.once('request', function(req, res) {
    req.resume();
    res.end();
    server.close();
    t.type(req.headers['x-domain-id'], 'string');
    t.equal(req.headers['x-domain-id'], d._id);
  });

  server.listen(port);

  var d = domain.create();

  server.once('listening', function() {
    d.run(function() {
      var options = {
        hostname: 'localhost',
        port: port
      };
      http.get(options, function(res) {
        res.resume();
      });
    });
  });
});
