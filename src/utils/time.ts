// 封装一个方法 :获取一个结果 ：当前 早上|上午|下午|晚上
export const getTime = () => {
  let message = ''
  // 通过内置的构造函数 Date
  let hours = new Date().getHours()
  if (hours <= 9) {
    message = '早上'
  } else if (hours <= 14) {
    message = '上午'
  } else if (hours <= 18) {
    message = '下午'
  } else {
    message = '晚上'
  }
  return message
}
