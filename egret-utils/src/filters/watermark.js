const url = require('url')

function safeBase64Encode (str) {
  str = btoa(str)
  str = str.replace(/\+/g, '-')
  str = str.replace(/\//g, '_')
  return str + Array((4 - str.length % 4) % 4 + 1).join('=')
}

export default function (value, imageOrText, options) {
  const urlComponents = url.parse(value)
  if (urlComponents.protocol !== 'http:' && urlComponents.protocol !== 'https:') {
    return value
  }

  let param = ''
  if (value.indexOf('watermark/3') === -1) {
    param = 'watermark/3'
  }
  param += '/' + (options.type || 'image') + '/' + (options.escaped ? imageOrText : safeBase64Encode(imageOrText)) + '/dissolve/' + (options.dissolve || 100) + '/gravity/' + (options.gravity || 'SouthEast') + '/dx/' + (options.dx || 0) + '/dy/' + (options.dy || 0)
  if (options.ws) {
    param += '/ws/' + options.ws
  }
  if (options.wst) {
    param += '/wst/' + options.wst
  }
  if (options.fill) {
    param += '/fill/' + safeBase64Encode(options.fill)
  }
  if (options.font) {
    param += '/font/' + safeBase64Encode(options.font)
  }
  if (options.fill) {
    param += '/fontsize/' + options.fontsize
  }

  const search = urlComponents.search
  if (search && search.length > 1) {
    if (options.search_merge_symbol !== undefined) {
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
