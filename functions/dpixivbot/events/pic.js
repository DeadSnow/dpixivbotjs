const { sendPic } = require("../utils/send")
const { loadDataFromMessage } = require("../utils/data")

module.exports = ({ bot, config }) => {

    bot.hears(/https?\:\/\/www\.pixiv\.net\/en\/artworks\/(?<picId>[0-9]+)/, (ctx) => {
        return sendPic(ctx, ctx.match.groups.picId, 0)
    })

    bot.hears(/\/?(pic|start)[ _]?(?<picId>[0-9]+)_?(?<picPage>[0-9]*)/, (ctx) => {
        return sendPic(ctx, ctx.match.groups.picId, ctx.match.groups.picPage || 0)
    })

    bot.command('pic', (ctx) => {
        if (ctx.message.reply_to_message) {
            const data = loadDataFromMessage(ctx.message.reply_to_message)
            if (data && data.id) return sendPic(ctx, data.id, data.page || 0)
        }
    })
}