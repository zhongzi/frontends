export default function (value) {
  if (!value) return
  value = value.replace(/<\/?[^>]*>/g, '') // 去除HTML tag
  value = value.replace(/[ | ]*\n/g, '\n') // 去除行尾空白
  value = value.replace(/&nbsp;/ig, '') // 去掉&nbsp;
  return value
}
