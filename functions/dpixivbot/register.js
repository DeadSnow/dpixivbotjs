const config = require("./config")
const translator = require("./translator")
const firestoreSession = require('telegraf-session-firestore')

module.exports = (bot, db) => {

    bot.use(firestoreSession(db.collection('sessions'), { getSessionKey: (ctx) => ctx.from && `${ctx.from.id}` }))

    bot.telegram.getMe().then((botInfo) => bot.context.botInfo = botInfo)

    bot.use((ctx, next) => {
        ctx.t = (word) => translator(word, ctx.session.lang || "en")
        return next()
    })

    bot.catch((err, ctx) => {
        console.log(`Ooops, encountered an error for ${ctx.updateType}`, err)
    })

    require("./events")({
        bot,
        config,
        db
    })
}