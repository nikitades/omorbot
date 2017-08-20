require('chromedriver');
const webdriver = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const fs = require('fs');
const Handlebars = require('handlebars');

module.exports = class Chatter {
    constructor(data) {
        this.pagePath = __dirname + '/../static/chatter.html';
        this.imgPath = __dirname + `/../static/${(new Date().getTime())}.png`;
        this.ready = new Promise((res, rej) => {
            this.data = data;
            this.conversation = data.conversation;
            this.drawHTML()
                .then(res, rej);
        });
    }

    drawHTML() {
        return new Promise((res, rej) => {
            let str = Handlebars.compile(fs.readFileSync(__dirname + '/templates/chatter.html').toString())(
                {
                    conversation: this.conversation
                });
            fs.writeFileSync(this.pagePath, str);
            res(this.pagePath);
        });
    }

    make() {
        return new Promise((res, rej) => {
            const options = new chrome.Options();
            options.addArguments(
                'headless',
                'disable-gpu',
                'load-component-extension',
                'disable-extensions'
            );
            const driver = new webdriver.Builder().withCapabilities(options.toCapabilities()).build();
            driver.get('file://' + this.pagePath)
                .then(() => {
                    return driver.takeScreenshot();
                }, rej)
                .then(base64 => {
                    res(new Buffer(base64, 'base64'));
                }, rej);
        });
    }
};