export default function (value, enums) {
  if (value === null) {
    return ''
  }
  return enums[value].text
}
