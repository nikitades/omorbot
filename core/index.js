const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
const router = new Router();
const config = require('../config');
const koastatic = require('koa-static');
const body = require('koa-body');
const prepareBody = require('./prepare');
const bot = require('../bot');

app.use(koastatic('static/', {hidden: true}));
app.use(body());
app.use(prepareBody);

app.context.channel = config.channel;
app.context.ok = {ok: true};
app.context.fail = {ok: false};
app.keys = config.secret;

router.get('*', ctx => {
    ctx.body = 'Sorry, the explicit sending is forbidden for the moment.';
});

router.post(`/webhook/1/${config.token}`, ctx => {
    if (Object.keys(ctx.request.body).length) {
        bot.handleUpdate(ctx.request.body).catch(console.log);
        ctx.body = ctx.ok;
    } else {
        console.log('FAILED UPDATE REQUEST!');
        console.log(ctx.request.body);
        ctx.body = ctx.fail;
        ctx.status = 404;
    }
});

require('./public_api')(app, router);

module.exports = {
    app,
    router
};