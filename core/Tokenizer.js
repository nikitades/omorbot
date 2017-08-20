const config = require('../config');
module.exports = class Tokenizer {
    verify(token) {
        return token === config.api_token;
    }

    verifyTelegram(channel, token) {
        switch (channel) {
            case '1':
                return token === config.token;
            default:
                return false;
        }
    }
};