const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const controller = require('./controller');
const http = require('http');
const https = require('https');
const fs = require('fs');

const app = new Koa();

var httpPort = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    // index page 
    if (ctx.request.path === '/') {
        ctx.response.type = 'html';
        ctx.response.body = fs.createReadStream('./index.html');   
    }
    await next();
});

// parse request body:
app.use(bodyParser());

// add controller:
app.use(controller());

http.createServer(app.callback()).listen(httpPort);
console.log('app started at port '+httpPort+'...');
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
