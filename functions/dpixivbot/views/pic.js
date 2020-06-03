const { dataUrl } = require("../utils/data");
const replyMarkup = require("./controls")
const { fixChars, originalToRegular, returnToHtml, changePage } = require("../utils/fixes")
const { PIC_LOAD_URL, PIXIV_PIC_URL } = require("../config")

const Telegraf = require('telegraf');

const prepareTags = (tags) => tags
    .map((tag) =>
        `<code>${tag.tag}</code>${tag.translation && "(" + tag.translation.en + ")" || ''}`
    )
    .join(", ")

const prepareCaption = (pic, data, url) => {
    return `<a href=\"${dataUrl(data, url)}\">${fixChars(pic.title)}</a> ${data.pageCount > 1 ? `(${data.page + 1}/${data.pageCount})` : ''}\n${pic.tags && `<b> Tags:</b> ${prepareTags(pic.tags.tags)}` || ''}`
}

exports.newPic = ({ pic, data, ctx }) => {
    return {
        photo: data.page > 0 ? changePage(pic.urls.regular, data.page) || originalToRegular(pic.urls.original, data.page) : pic.urls.regular || originalToRegular(pic.urls.original, 0),
        caption: prepareCaption(pic, data, PIC_LOAD_URL),
        reply_markup: replyMarkup(data, ctx)
    }
}

exports.channelPic = ({ pic, data, ctx }) => {
    return {
        photo: data.page > 0 ? changePage(pic.urls.regular, data.page) : pic.urls.regular,
        reply_markup: Telegraf.Extra.markup((markup) => markup.inlineKeyboard([
            [
                markup.urlButton(ctx.t('source'), PIXIV_PIC_URL + data.id),
                markup.urlButton(ctx.t('more'), `https://t.me/${ctx.botInfo.username}?start=${data.page > 0 ? `${data.id}_${data.page}` : data.id}`),
            ]
        ])).reply_markup
    }
}

exports.updatePic = ({ data, caption, ctx }) => {
    return {
        photo: originalToRegular(data.url, data.page),
        caption: returnToHtml(caption.text, caption.entities),
        reply_markup: replyMarkup(data, ctx)
    }
}

exports.updateText = ({ data, text, ctx }) => {
    return {
        text: returnToHtml(text.text, text.entities),
        reply_markup: replyMarkup(data, ctx)
    }
}

