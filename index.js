const core = require('./core');

core.app
    .use(core.router.routes())
    .listen(require('./config').port);