const Koa = require('koa');
const getImmStatus = require('./immstatus');

// 创建一个Koa对象表示web app本身:
const app = new Koa();

// 对于任何请求，app将调用该异步函数处理请求：
app.use(async (ctx, next) => {
    if(ctx.request.path==='/check'){
        await next();
        const status = await getImmStatus("EP00255112", "LI", "1970", "10", "25", "china");
        if(status != undefined)
            console.log(status.brief, status.details);
        else
            console.log("error!");
        ctx.response.type = 'text/html';
        ctx.response.body = '<h1>'+status.brief+'</h1>';
    }else{
        ctx.response.type = 'text/html';
        ctx.response.body = '<h1>Hello, Canada!</h1>';
    }
});

// 在端口3000监听:
app.listen(3000);
console.log('app started at port 3000...');