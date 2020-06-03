const bot = require("./dpixivbot/bot")

const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.cert(require("./serviceAccountKey.json"))
});

require("./dpixivbot/register")(bot, admin.firestore())

bot.launch()