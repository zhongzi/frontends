const path = require('path');
const fs = require('fs');

module.exports = function(input, map) {
  this.cacheable();
  const pathObj = path.parse(this.resourcePath);
  const name = pathObj.name;
  const skip = (name.indexOf('@2x') === name.length - 3 || name.indexOf('@3x') === name.length - 3);
  if (!skip) {
    for (let i = 2; i <= 3; ++i) {
      const otherPath = path.join(pathObj.dir, pathObj.name + '@' + i + 'x' + pathObj.ext);
      if (!fs.existsSync(otherPath)) {
        this.callback(new Error(otherPath + ' is not exist'), input, map);
        return ;
      }
    }
  }
  this.callback(null, input, map);
};
