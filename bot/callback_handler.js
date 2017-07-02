module.exports = ctx => {
    return ctx.answerCallbackQuery(`Ты выбрал ${ctx.match[0]}! Хуяссе`);
};