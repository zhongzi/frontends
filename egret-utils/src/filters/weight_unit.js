import unit from './unit'

export default function (num, fixed = 2, slot = '-', units = ['t', 'kg'], max = undefined) {
  return unit(num, [1000, 0], units, fixed, slot, max)
}
