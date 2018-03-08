const getImmStatus = require("../immstatus");

module.exports = {
    'GET /api/statuscheck': async (ctx, next) => {
        console.log(ctx.query);
        console.log(ctx.querystring);
        // set Content-Type:
        ctx.response.type = 'application/json';
        // set Response Body:
        ctx.response.body = {
            brief: "Failed.",
            details: "Please use POST method."
        };
    },
    'POST /api/statuscheck': async (ctx, next) => {
        let data = ctx.request.body;
        let result = await getImmStatus(data.appid, data.surname, data.birthday, data.cob);
        ctx.response.type = 'application/json';
        if(result!=undefined){
            ctx.response.body = {
                brief: result.brief,
                details: result.details
            };
        }else{
            ctx.response.body={
                brief:"Failed",
                details:"Please check your input and try again."
            }
        }

    }
}