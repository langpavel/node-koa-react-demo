
var koa = require('koa');


var app = koa();


// x-response-time
app.use(function *xResponseTime(next){
  var start = process.hrtime();
  yield next;
  var diff = process.hrtime(start);
  this.set('X-Response-Time', (diff[0] * 1e3 + diff[1] / 1e6) + 'ms');
});


app.use(function *() {
	this.body = 'Hello World!';
});


app.listen(process.env.PORT || 3000);
