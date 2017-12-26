/*  七牛图片处理
  w: 宽/长边
  h: 高/短边
  m: 图片处理模式（详细参数参见文档）
  format: 新图的输出格式,取值范围：jpg，gif，png，webp等，默认为原图格式。
  interlace: 是否支持渐进显示，取值范围：1 支持渐进显示，0不支持渐进显示(默认为0)，适用目标格式：jpg。
  q: 新图的图片质量,取值范围是[1, 100]，默认75
 */

var url = require('url');
var systemDppx = 1;
if (typeof wx !== 'undefined' && wx.getSystemInfoSync) {
  var systemInfo = wx.getSystemInfoSync();
  systemDppx = systemInfo.pixelRatio
} else {
  var res = require('res');
  systemDppx = res.dppx() || 1
}

module.exports = function (value, w, h, m, interlace, format, q, dppx) {
  if (!value) {
    return;
  }

  dppx = dppx || systemDppx

  var urlComponents = url.parse(value);
  if (urlComponents.protocol !== 'http:' && urlComponents.protocol !== 'https:') {
    return value;
  }

  var params = [];
  params.push('imageView2/' + (m || 0));
  w && params.push('/w/' + Math.ceil(w * dppx));
  h && params.push('/h/' + Math.ceil(h * dppx));
  format && params.push('/format/' + format);
  interlace && params.push('/interlace/' + interlace);
  q && params.push('/q/' + q);

  var search = urlComponents.search;
  if (search && search.length > 1) {
    urlComponents.search += '&';
  } else {
    urlComponents.search = '?';
  }
  urlComponents.search += params.join('');

  return url.format(urlComponents);
}

// 具体设置可参考: https://developer.qiniu.com/dora/manual/1279/basic-processing-images-imageview2
