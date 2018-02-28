const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const controller = require('./controller');
const http = require('http');
const https = require('https');
const fs = require('fs');

const app = new Koa();

// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});

// parse request body:
app.use(bodyParser());

// add controller:
app.use(controller());

// SSL options 
var options = {
    key: fs.readFileSync('./key/privkey.pem'),
    cert: fs.readFileSync('./key/server.crt')
  }

//http.createServer(app.callback()).listen(80);
//http.createServer(app.callback()).listen(3000);
https.createServer(options, app.callback()).listen(9090);
//app.listen(3000);
console.log('security app started at port 9090...');