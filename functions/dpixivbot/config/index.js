const functions = require('firebase-functions');

const config = functions.config()

module.exports = {
    BOT_TOKEN: config.bot.token,
    PIC_LOAD_URL: config.pic.load_url,
    PIXIV_PIC_URL: config.pixiv.pic_url,
    LANGS: [{ key: "en", text: "🇬🇧 English" }, { key: "ru", text: "🇷🇺 Русский" }],
    MIN_PACK_COUNT: parseInt(config.pack.min),
    MAX_PACK_COUNT: parseInt(config.pack.max),
    PACK_SIZE: parseInt(config.pack.size),
    DEFAULT_CONFIG: {
        description: true,
        group: true,
        count: 5
    },
    DEFAULT_SESSION: config.default.session
}