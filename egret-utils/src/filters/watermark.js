var url = require('url')

function safeBase64Encode (str) {
  str = btoa(str)
  str = str.replace(/\+/g, '-')
  str = str.replace(/\//g, '_')
  return str + Array((4 - str.length % 4) % 4 + 1).join('=')
}

export default function (value, imageUrl, options) {
  var urlComponents = url.parse(value)
  if (urlComponents.protocol !== 'http:' && urlComponents.protocol !== 'https:') {
    return value
  }

  let param = 'watermark/1/image/' + safeBase64Encode(imageUrl) +
    '/dissolve/' + (options.dissolve || 100) +
    '/gravity/' + (options.gravity || 'SouthEast') +
    '/dx/' + (options.dx || 0) +
    '/dy/' + (options.dy || 0)
  if (options.wx) {
    param += '/wx/' + options.wx
  }

  var search = urlComponents.search
  if (search && search.length > 1) {
    if (options.search_merge_symbol && options.search_merge_symbol.length > 0) {
      urlComponents.search += options.search_merge_symbol
    } else {
      urlComponents.search += '&'
    }
  } else {
    urlComponents.search = '?'
  }
  urlComponents.search += param
  return url.format(urlComponents)
}
