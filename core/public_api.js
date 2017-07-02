const understand = require('./understand');
const Tokenizer = require('./tokenizer');
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
                ctx.body = understand(ctx);
        }
    });
};