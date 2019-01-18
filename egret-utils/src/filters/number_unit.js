import unit from './unit'

export default function (num, max = 5, fixed = 2, slot = '-', units = ['亿', '万', '']) {
  return unit(num, [100000000, 10000, 0], units, fixed, slot, max)
}
