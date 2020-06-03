const { loadData } = require("../utils/data")
const update = require("../utils/update")

module.exports = ({ bot }) => {

    const showPage = (ctx, data) => ctx.answerCbQuery(`[${data.page + 1}/${data.pageCount}]`)

    bot.action('prev', (ctx) => loadData(ctx, (data) => {
        data.page = data.page - 1 < 0 ? data.pageCount - 1 : data.page - 1
        return update(ctx, data, true).then(showPage(ctx, data))
    }))

    bot.action('next', (ctx) => loadData(ctx, (data) => {
        data.page = data.page + 1 >= data.pageCount ? 0 : data.page + 1
        return update(ctx, data, true).then(showPage(ctx, data))
    }))

    bot.action('show', (ctx) => loadData(ctx, (data) => {
        data.show = true
        return update(ctx, data).then(() => ctx.answerCbQuery(ctx.t('shown')))
    }))

    bot.action('hide', (ctx) => loadData(ctx, (data) => {
        data.show = false
        return update(ctx, data).then(() => ctx.answerCbQuery(ctx.t('hidden')))
    }))

    bot.action('file', (ctx) => loadData(ctx, (data) => {
        return ctx.answerCbQuery(ctx.t('loading...')).then(() => ctx.replyWithDocument(data.url, { reply_to_message_id: ctx.callbackQuery.message.message_id }))
    }))

    bot.action('similar', (ctx) => loadData(ctx, (data) => {
        data.choosed = "similar"
        return update(ctx, data).then(() => ctx.answerCbQuery(ctx.t('similar_menu')))
    }))

    bot.action('sender', (ctx) => loadData(ctx, (data) => {
        data.choosed = "sender"
        return update(ctx, data).then(() => ctx.answerCbQuery(ctx.t('sender_menu')))
    }))

    bot.action('back', (ctx) => loadData(ctx, (data) => {
        data.choosed = null
        return update(ctx, data).then(() => ctx.answerCbQuery(ctx.t('to_main')))
    }))
}