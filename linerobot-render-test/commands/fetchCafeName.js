import axios from 'axios'
import temp from '../temp/cafe.js'
import writejson from '../utils/writejson.js'
import _ from 'loadsh'
import validator from 'validator'

export default async (event) => {
  try {
    // 查店名
    const { data } = await axios.get('https://cafenomad.tw/api/v1.2/cafes')
    // console.log('aaa' + event.message.text.substr(4))
    const cafes = data.filter(cafe => cafe.name.includes(event.message.text.substr(4)))
    console.log(cafes)

    const bubbles = []
    for (const cafe of cafes) {
      console.log(cafe)
      const bubble = JSON.parse(JSON.stringify(temp))
      const map = 'https://www.google.com.tw/maps/place/' + cafe.address
      bubble.body.contents[0].text = cafe.name || '-'
      // bubble.body.contents[1].contents[0].contents[1].text = cafe.address || '-'
      bubble.body.contents[1].contents[0].contents[2].text = cafe.address || '-'
      // bubble.body.contents[1].contents[1].contents[1].text = cafe.open_time || '-'
      bubble.body.contents[1].contents[1].contents[2].text = cafe.open_time || '-'
      bubble.footer.contents[0].action.uri = encodeURI(cafe.url) || '-'
      bubble.footer.contents[1].action.uri = encodeURI(map)
      if (!cafe.address) bubble.footer.contents.splice(1, 1)
      if (!cafe.url || !validator.isURL(cafe.url)) bubble.footer.contents.splice(0, 1)
      // bubble.footer.contents[1].action.uri.push(map) => is not a function at default

      // bubble.body.contents[1].contents[0].contents[0].text = cafe.find('address').text().trim()
      bubbles.push(bubble)
      //   if (bubbles.length >= 12) { break }
      // }
    }

    const replies = _.chunk(bubbles, 10).slice(0, 5).map(bubblesss => {
      console.log(bubblesss)
      return {
        type: 'flex',
        altText: '咖啡店_店名查詢結果',
        contents: {
          type: 'carousel',
          contents: bubblesss
        }
      }
    })

    // console.log(bubbles)
    // const reply = {
    //   type: 'flex',
    //   altText: '咖啡店_店名查詢結果',
    //   contents: {
    //     type: 'carousel',
    //     contents: bubbles
    //   }
    // }
    if (bubbles.length === 0) {
      event.reply('目前未找到相符的資料，請稍候再試')
      return
    }
    event.reply(replies)
    if (process.env.WRITEJSON) {
      for (const i in replies) {
        writejson(replies[i], `bubbles${i}`)
      }
    }
    // writejson(replies, 'cafes')
    // writejson(replies, 'bubbles')
  } catch (error) {
    console.log(error)
    event.reply('目前未找到資料，請稍候再試')
  }
}
