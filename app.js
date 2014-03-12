
var koa = require('koa');
var session = require('koa-session-redis');


var app = koa();


// see https://github.com/koajs/koa/blob/master/docs/api/index.md#appkeys
app.keys = ['new key', 'old key'];


// x-response-time
app.use(function *xResponseTime(next) {
  var start = process.hrtime();
  yield next; // process next middleware
  var diff = process.hrtime(start);
  this.set('X-Response-Time', (diff[0] * 1e3 + diff[1] / 1e6) + 'ms');
});

app.use(session({ signed: true }));
// middleware below can use `this.session`

app.use(function *(next) {
  // only for homepage
  if ('/' != this.path) return next;

  // see https://github.com/jed/cookies#cookiesget-name--options--
  var clientRequestCount = (this.session.counter || 0) + 1;
  this.session.counter = clientRequestCount;

  this.body = 'Hello World!\n';
  this.body += 'Client request count: ' + clientRequestCount + '\n';
});


app.listen(process.env.PORT || 3000);
