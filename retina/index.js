var res = require('res');

var densities = [1, 2, 3];

function getBestDensity () {
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
  install: function (Vue) {
    var bestDensity = getBestDensity();
    Vue.prototype.$density = bestDensity;
    var densityStr = '';
    if (bestDensity !== 3) {
      densityStr = '@' + bestDensity + 'x';
    }
    Vue.densityStr = densityStr
    Vue.prototype.$densityStr = densityStr;
  }
}
