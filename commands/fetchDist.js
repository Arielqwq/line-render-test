import axios from 'axios'
import temp from '../temp/cafe.js'
import writejson from '../utils/writejson.js'
import _ from 'loadsh'
import validator from 'validator'

// 抓輸入的location的 latitude/longitude
// 呼叫比對經緯度的function
// 回傳最相近的咖啡廳
export default async (event) => {
  try {
    const lat1 = event.message.latitude
    const lon1 = event.message.longitude
    const { data } = await axios.get('https://cafenomad.tw/api/v1.2/cafes')
    const filtered = data.filter(coffee => {
      const dis = distance(lat1, lon1, coffee.latitude, coffee.longitude, 'K')
      return dis <= 5
    })
    console.log(filtered)
    const bubbles = []
    for (const coffee of filtered) {
      console.log(coffee)
      const bubble = JSON.parse(JSON.stringify(temp))
      const map = 'https://www.google.com.tw/maps/place/' + coffee.address
      bubble.body.contents[0].text = coffee.name || '-'
      // bubble.body.contents[1].contents[0].contents[1].text = coffee.address || '-'
      bubble.body.contents[1].contents[0].contents[2].text = coffee.address || '-'
      // bubble.body.contents[1].contents[1].contents[1].text = coffee.open_time || '-'
      bubble.body.contents[1].contents[1].contents[2].text = coffee.open_time || '-'
      bubble.footer.contents[0].action.uri = encodeURI(coffee.url)
      bubble.footer.contents[1].action.uri = encodeURI(map)
      if (!coffee.address) bubble.footer.contents.splice(1, 1)
      if (!coffee.url || !validator.isURL(coffee.url, { require_protocol: true })) bubble.footer.contents.splice(0, 1)

      bubbles.push(bubble)
      // 查location
    }
    const replies = _.chunk(bubbles, 12).slice(0, 5).map(bubblesss => {
      console.log(bubblesss)
      return {
        type: 'flex',
        altText: '咖啡店_距離查詢結果',
        contents: {
          type: 'carousel',
          contents: bubblesss
        }
      }
    })
    // }
    // // console.log(bubbles)
    // const reply = {
    //   type: 'flex',
    //   altText: '咖啡店查詢結果',
    //   contents: {
    //     type: 'carousel',
    //     contents: bubbles
    //   }
    // }
    if (bubbles.length === 0) {
      event.reply('目前尚未找到符合的資料，請換個地點再試一次')
      return
    }
    event.reply(replies)
    if (process.env.WRITEJSON) {
      for (const i in replies) {
        writejson(replies[i], `bubbles${i}`)
      }
    }
    // event.reply(reply)
    // writejson(reply, 'cafes')
  } catch (error) {
    console.log(error)
    event.reply('此地點目前尚未找到符合的資料，請換個地點再試一次')
  }
}

// 比較經緯度的function
// lat1 點 1 的緯度
// lon1 點 1 的經度
// lat2 點 2 的緯度
// lon2 點 2 的經度
// unit 單位，不傳是英里，K 是公里，N 是海里
const distance = (lat1, lon1, lat2, lon2, unit) => {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0
  } else {
    const radlat1 = (Math.PI * lat1) / 180
    const radlat2 = (Math.PI * lat2) / 180
    const theta = lon1 - lon2
    const radtheta = (Math.PI * theta) / 180
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
    if (dist > 1) {
      dist = 1
    }
    dist = Math.acos(dist)
    dist = (dist * 180) / Math.PI
    dist = dist * 60 * 1.1515
    if (unit === 'K') {
      dist = dist * 1.609344
    }
    if (unit === 'N') {
      dist = dist * 0.8684
    }
    return dist
  }
}
