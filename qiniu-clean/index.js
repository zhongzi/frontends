const qiniu = require('qiniu')
const pathUtil = require('path')
const fs = require('fs')

const min = 3

class QiniuCleaner {
  constructor ({
    ACCESS_KEY,
    SECRET_KEY,
    bucket,
    path,
    days,
    delay,
    exclude
  }) {
    if (!ACCESS_KEY || !SECRET_KEY) {
      throw new Error('ACCESS_KEY and SECRET_KEY must be provided');
    }
    if (!bucket) {
      throw new Error('bucket must be provided')
    }
    if (!path || path.length < min) {
      throw new Error('path must be provided')
    }

    const mac = new qiniu.auth.digest.Mac(
      ACCESS_KEY, SECRET_KEY)
    const config = new qiniu.conf.Config
    this.bucketManager = new qiniu.rs.BucketManager(mac, config)
    this.bucket = bucket
    this.path = path
    this.days = parseInt(days, 10)
    this.delay = delay
    this.exclude = exclude
  }

  apply (compiler) {
    compiler.plugin('after-emit', (compilation, callback) => {
      const path = this.path.replace('[hash]', compilation.hash)
      const assets = compilation.assets
      let includes = Object.keys(assets).filter((fileName) => {
        return assets[fileName].emitted
      }).reduce((current, fileName) => {
        current[pathUtil.join(path, fileName)] = true
        return current
      }, {})
      if (this.delay) {
        const file = this.delay
        fs.readFile(file, 'utf8', function (err, data) {
          if (data) {
            const existIncludes = JSON.parse(data)
            includes = Object.assign(existIncludes, includes)
          }
          fs.writeFile(file, JSON.stringify(includes), 'utf8', callback)
        })
      } else {
        this.cleanIfNot(includes, this.exclude, path, undefined, callback)
      }
    })
  }

  cleanIfNot (includes, exclude, path, marker, callback) {
    this.bucketManager.listPrefix(this.bucket, {
      prefix: path,
      marker: marker,
      limit: 1000
    }, (err, respBody, respInfo) => {
      if (err) {
        callback(err)
        return
      }
      if (respInfo.statusCode === 200) {
        const items = respBody.items
        const operations = items.reduce((current, item) => {
          if (exclude && exclude.test(item.key)) {
            return current
          }
          if (includes[item.key] !== true) {
            if (this.days > 0) {
              current.push(qiniu.rs.deleteAfterDaysOp(
                this.bucket, item.key, this.days))
            } else if (this.days === 0) {
              current.push(qiniu.rs.deleteOp(
                this.bucket, item.key))
            }
          }
          return current
        }, [])

        const nextMarker = respBody.marker
        if (operations.length > 0) {
          this.bucketManager.batch(operations, (err, respBody, respInfo) => {
            if (err) {
              callback(err)
              return
            }
            if (parseInt(respInfo.statusCode / 100) === 2) {
              if (nextMarker) {
                this.cleanIfNot(includes, exclude, path, nextMarker, callback)
              } else {
                callback()
              }
            } else {
              callback(new Error(JSON.stringify(respBody)))
            }
          })
        } else {
          if (nextMarker) {
            this.cleanIfNot(includes, exclude, path, nextMarker, callback)
          } else {
            callback()
          }
        }
      } else {
        callback(new Error(JSON.stringify(respBody)))
      }
    })
  }
}

module.exports = QiniuCleaner
