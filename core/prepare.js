const busboy = require('async-busboy');
module.exports = async (ctx) => {
    let {files, fields} = await busboy(ctx.req);
    ctx.request.body = ctx.request.body || {};
    for (let i in fields) {
        ctx.request.body[i] = fields[i];
    }
    for (let i in files) {
        ctx.request.body[files[i].fieldname] = files[i];
    }
};