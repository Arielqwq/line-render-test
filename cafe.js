import axios from 'axios'

export let cafes = []
export const updateCafes = async () => {
  cafes.push('aaa')
  try {
    const { data } = await axios.get('https://cafenomad.tw/api/v1.2/cafes')
    cafes = data
    console.log('取得資料')
  } catch (error) {
    console.log('錯誤')
  }
}
