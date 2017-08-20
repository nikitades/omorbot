const r = require('request');
module.exports = class Conversation {
    constructor(obj) {
        let check;
        if (check = this.checkChat(obj.conversation) !== true) throw new Error(check);
        this.names = [];
        return this.parseChat(obj.conversation);
    }

    checkChat(conv) {
        return typeof conv !== 'object' ? 'Smth wrong given!!' :
            !Array.isArray(conv) ? `The conversation is not an array! It's ${typeof conv}` :
                typeof conv[0] !== 'object' ? 'The first conversation item is not an array!' :
                    true;
    }

    async parseChat(conv) {
        let parsed_conv = [];
        for (let i in conv) {
            let item = conv[i];
            if (parsed_conv[0] && parsed_conv[0].from_id === item.from_id) {
                parsed_conv[0].items.unshift(item);
            } else parsed_conv.unshift({
                from_id: item.from_id,
                name: await this.getName(item.from_id),
                items: [item]
            });
        }
        return parsed_conv;
    }

    async getName(id) {
        return this.names[id] || await this.requestName(id);
    }

    requestName(id) {
        return new Promise((res, rej) => {
            r(`https://api.vk.com/method/users.get?user_ids=${id}`, (e, r, body) => {
                body = JSON.parse(body);
                if ('response' in body && 'first_name' in body.response[0]) res(body.response[0].first_name);
                else rej(body);
            });
        });
    }
};