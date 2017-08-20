const do_msg = require('./do_msg');
const do_chatter = require('./do_chatter');
const Tokenizer = require('./Tokenizer');
const tokenizer = new Tokenizer();

module.exports = (app, router) => {
    router.post('/me/:token/msg', async ctx => {
        let token = ctx.params.token;
        switch (true) {
            case !token || !tokenizer.verify(token):
                ctx.body = 'Sorry, the token has been mismatched.';
                break;
            case !('author' in ctx.request.body):
                ctx.body = 'Warning! Parameters mismatch (author)';
                break;
            case !('msg' in ctx.request.body):
                ctx.body = 'Warning! Parameters mismatch (msg)';
                break;
            default:
                ctx.body = do_msg(ctx);
        }
    });

    router.post('/me/:token/chatter', async ctx => {
        let token = ctx.params.token;
        switch (true) {
            case !token || !tokenizer.verify(token):
                ctx.body = 'Sorry, the token has been mismatched';
                break;
            case !('conversation' in ctx.request.body):
                ctx.body = 'No conversation given!';
                break;
            default:
                ctx.body = await do_chatter(ctx);
        }
    });
};