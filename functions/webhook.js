const bot = require("./dpixivbot/bot")

const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore()

require("./dpixivbot/register")(bot, db)

module.exports = (req, res) => bot.handleUpdate(req.body).then(() => res.end('ok'))
