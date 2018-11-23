import unit from './unit'

export default function (num, fixed = 2, slot = '-', units = ['t', 'kg']) {
  return unit(num, [1000, 0], units, fixed, slot)
}
