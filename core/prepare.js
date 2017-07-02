const busboy = require('async-busboy');
module.exports = async (ctx, next) => {
    if (ctx.method === 'POST' && 'content-type' in ctx.request.header && ctx.request.header['content-type'].substr(0, 'multipart/form-data'.length) === 'multipart/form-data') {
        let {files, fields} = await busboy(ctx.req);
        ctx.request.body = ctx.request.body || {};
        for (let i in fields) {
            ctx.request.body[i] = fields[i];
        }
        for (let i in files) {
            ctx.request.body[files[i].fieldname] = files[i];
        }
    }
    return next();
};