const r = require('request');
const config = require("../config");
module.exports = class Conversation {
    constructor(obj) {
        let check;
        if (check = this.checkChat(obj.conversation) !== true) throw new Error(check);
        this.userDataStash = [];
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
                parsed_conv[0].items.unshift(this.extractMessage(item));
            } else parsed_conv.unshift({
                from_id: item.from_id,
                name: await this.getUserData(item.from_id, 'first_name'),
                image: await this.getUserData(item.from_id, 'photo_50'),
                items: [this.extractMessage(item)]
                //TODO: закончил тут. ломается жсон
            });
        }
        return parsed_conv;
    }

    extractMessage(source_msg) {
        return {
            body: source_msg.body || ''
        }
    }

    async getUserData(id, field) {
        let data = this.userDataStash[id] || await this.requestUserData(id);
        if (id !== config.personality) {
            data['first_name'] = 'Ебан';
            data['last_name'] = 'Барабан';
        }
        return (this.userDataStash[id] = data)[field];
    }

    requestUserData(id) {
        return new Promise((res, rej) => {
            r(`https://api.vk.com/method/users.get?user_ids=${id}&fields[]=photo_50`, (e, r, body) => {
                body = JSON.parse(body);
                if ('response' in body && 'first_name' in body.response[0]) res(body.response[0]);
                else rej(body);
            });
        });
    }
};