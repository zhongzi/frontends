#!/usr/bin/env node

const program = require('commander')
const build = require('../build.js')
let config = {}

program
  .version(require('../package.json').version)
  .option('-d --densities [densities]', '目标 densities', function (densities) {config.densities = densities.split(',')})
  .option('-b --base [base density]', '基础 density', function (density) {config.baseDensity = density})
  .parse(process.argv)

build(program.args[0], config.baseDensity || 3, config.densities || [1, 2], function () {
  console.log('🍺 finished')
})
