const res = require('res');
const densities = [1, 2, 3];

const getBestDensity = function () {
  var systemDppx = res.dppx() || 1;
  var currentDistance = 1000;
  var bestDensity = 1;
  for (var i = 0; i < densities.length; i++) {
    var density = densities[i];
    var distance = Math.abs(density - systemDppx);
    if (distance < currentDistance) {
      bestDensity = density;
      currentDistance = distance;
    }
  }
  return bestDensity;
}

module.exports = {
  getBestDensity: getBestDensity,
  install: function (Vue, options) {
    var bestDensity = getBestDensity();
    Vue.prototype.$density = bestDensity;
    var densityStr = '';
    if (bestDensity !== 1) {
      densityStr = '@' + bestDensity + 'x';
    }
    window.densityStr = densityStr;
    Vue.prototype.$densityStr = densityStr;
  }
}
