const { Telegraf } = require("telegraf")
const { BOT_TOKEN } = require("./config")

module.exports = new Telegraf(BOT_TOKEN);