
var koa = require('koa');


var app = koa();


// see https://github.com/koajs/koa/blob/master/docs/api/index.md#appkeys
app.keys = ['new key', 'old key'];


// x-response-time
app.use(function *xResponseTime(next){
  var start = process.hrtime();
  yield next; // process next middleware
  var diff = process.hrtime(start);
  this.set('X-Response-Time', (diff[0] * 1e3 + diff[1] / 1e6) + 'ms');
});


app.use(function *(next) {
  // only for homepage
  if ('/' != this.path) return next;

  // see https://github.com/jed/cookies#cookiesget-name--options--
  var clientRequestCount = this.cookies.get('counter', { signed: true }) || 1;

  this.body = 'Hello World!\n';
  this.body += 'Client request count: ' + clientRequestCount + '\n';

  clientRequestCount++;

  // see https://github.com/jed/cookies#cookiesset-name--value---options--
  this.cookies.set('counter', clientRequestCount, { signed: true });
});


app.listen(process.env.PORT || 3000);
