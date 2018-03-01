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
    // index page 
    if (ctx.request.path === '/') {
        ctx.body = "hello world from " + ctx.request.url;
    }
    await next();
});

// parse request body:
app.use(bodyParser());

// add controller:
app.use(controller());

http.createServer(app.callback()).listen(8080);
console.log('app started at port 8080...');
// SSL options 
try{
    var options = {
        key: fs.readFileSync('./key/privkey.pem'),
        cert: fs.readFileSync('./key/server.crt')
    }
    https.createServer(options, app.callback()).listen(9090);
    console.log('app(https) started at port 9090...');

}catch(error){
    console.log(error);
}

//http.createServer(app.callback()).listen(80);
//app.listen(3000);
