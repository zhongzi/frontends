export default function (value, decimals = 2, symbol = '') {
  if (!value) {
    value = 0
  }
  return symbol + Number(Math.round(value + 'e' + decimals) + 'e-' + decimals).toFixed(decimals)
}
