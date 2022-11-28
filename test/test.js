import axios from 'axios'
import temp from '../temp/cafe.js'
import writejson from '../utils/writejson.js'

const main = async (event) => {
  try {
    // 查店名
    const { data } = await axios.get('https://cafenomad.tw/api/v1.2/cafes')
    const names = data.name
    const cafes = data.filter(cafe => cafe.name.includes(event.message.text))
    console.log('cafes' + cafes)

    const bubbles = []
    if (names.includes(event)) {
      for (const cafe of cafes) {
        // console.log(cafe)
        const bubble = JSON.parse(JSON.stringify(temp))
        const map = 'https://www.google.com.tw/maps/place/' + cafe.address
        bubble.body.contents[0].text = cafe.name || '-'
        bubble.body.contents[1].contents[0].contents[1].text = cafe.address || '-'
        bubble.body.contents[1].contents[1].contents[1].text = cafe.open_time || '-'
        bubble.footer.contents[0].action.uri = encodeURI(cafe.url)
        bubble.footer.contents[1].action.uri = encodeURI(map)
        if (!cafe.address) bubble.footer.contents.splice(1, 1)
        if (!cafe.url) bubble.footer.contents.splice(0, 1)
        // bubble.footer.contents[1].action.uri.push(map) => is not a function at default

        // bubble.body.contents[1].contents[0].contents[0].text = cafe.find('address').text().trim()
        bubbles.push(bubble)
      }
    }

    // console.log(bubbles)
    const reply = {
      type: 'flex',
      altText: '咖啡店_店名查詢結果',
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
}
main('蜂巢咖啡')
