// 引用 dotenv 讀取.env 檔的設定
import 'dotenv/config'
// 引用 linebot
import linebot from 'linebot'
import fetchCafe from './commands/fetchCafe.js'

// 查店名----------------------------
import fetchCafeName from './commands/fetchCafeName.js'
// 查店名----------------------------

// 查location-----------------------
import fetchDist from './commands/fetchDist.js'
// 查location-----------------------

import express from 'express'

import { updateCafes } from './cafe.js'
import { scheduleJob } from 'node-schedule'
scheduleJob('', updateCafes)
updateCafes()

const app = express()

// console.log(process.env)
// 設定 linebot 用linebot套件建立一個機器人
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

bot.on('message', event => {
  console.log(event.message)
  if (event.message.type === 'location') {
    fetchDist(event)
  } else if (event.message.type === 'text') {
    // 查店名----------------------------
    if (event.message.text.startsWith('查店名 ')) {
      fetchCafeName(event)
      // 查店名----------------------------
      // 查location-----------------------
    } else if (event.message.type === 'location') {
      // 查location-----------------------
      // 查捷運-----------------------------
    } else if (event.message.text.startsWith('查捷運 ')) {
      fetchCafe(event)// 查捷運-----------------------------
    } else if (event.message.text === '怎麼查捷運？') {
      event.reply(`依捷運名：「查捷運 ｘｘｘ 」。
例：查捷運 南港展覽館`)
    } else if (event.message.text === '怎麼查店名？') {
      event.reply(`依店家名：「查店名 ｘｘｘ」。
例：查店名 好咖啡`)
    } else if (event.message.text === '怎麼查位置？') {
      event.reply(`依距離：分享位置資訊給機器人。
動動您的手指，請至左下角新增點選，分享您目前的位置。`)
    } else {
      event.reply(`輸入的格式錯了喔～
請點開下方選單，查詢搜尋格式`)
    }
  }
})
// 放render
const linebotParser = bot.parser()
app.post('/', linebotParser)
app.get('/', (req, res) => {
  res.status(200).send('ok')
})
// 放render

// linebot 偵測指定 port 的指定路徑請求
// 雲端機器人會自動偵測 port 所以不寫死
// bot.listen('/', process.env.PORT || 3000, () => {

// 放render
app.listen(process.env.PORT || 3000, () => {
  console.log('機器人啟動')
})
