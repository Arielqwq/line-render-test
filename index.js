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
    } else {
      fetchCafe(event)
    } // 查捷運-----------------------------
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
