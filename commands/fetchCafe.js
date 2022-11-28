import axios from 'axios'
import temp from '../temp/cafe.js'
import writejson from '../utils/writejson.js'

export default async (event) => {
  // if (event.message.type === 'text') {
  try {
    // 查捷運站
    const { data } = await axios.get('https://cafenomad.tw/api/v1.2/cafes')
    const cafes = data.filter(cafe => cafe.mrt === event.message.text.substr(4))
    console.log(cafes)
    const bubbles = []
    for (const cafe of cafes) {
      // console.log(cafe)
      const bubble = JSON.parse(JSON.stringify(temp))
      const map = 'https://www.google.com.tw/maps/place/' + cafe.address
      bubble.body.contents[0].text = cafe.name || '-'
      // bubble.body.contents[1].contents[0].contents[1].text = cafe.address || '-'
      bubble.body.contents[1].contents[0].contents[2].text = cafe.address || '-'
      // bubble.body.contents[1].contents[1].contents[1].text = cafe.open_time || '-'
      bubble.body.contents[1].contents[1].contents[2].text = cafe.open_time || '-'
      bubble.footer.contents[0].action.uri = encodeURI(cafe.url)
      bubble.footer.contents[1].action.uri = encodeURI(map)
      if (!cafe.address) bubble.footer.contents.splice(1, 1)
      if (!cafe.url) bubble.footer.contents.splice(0, 1)
      // bubble.footer.contents[1].action.uri.push(map) => is not a function at default

      // bubble.body.contents[1].contents[0].contents[0].text = cafe.find('address').text().trim()
      bubbles.push(bubble)
      // 查捷運站
    }
    // console.log(bubbles)
    const reply = {
      type: 'flex',
      altText: '咖啡店_捷運站名查詢結果',
      contents: {
        type: 'carousel',
        contents: bubbles
      }
    }
    event.reply(reply)
    writejson(reply, 'cafes')
  } catch (error) {
    console.log(error)
    event.reply('目前未找到資料，請稍候再試')
  }
  // }
}
