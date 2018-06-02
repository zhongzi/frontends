const qiniu = require('qiniu')

const min = 3

class QiniuCleaner {
  constructor ({
    key,
    secret,
    bucket,
    prefix
  }) {
    if (!bucket) {
      throw new Error('请传入 bucket')
    }
    if (!prefix || prefix.length < min) {
      throw new Error(`前缀至少需要${min}`)
    }
    const last = prefix[prefix.length - 1]
    if (last !== '/') {
      prefix += '/'
    }

    const mac = new qiniu.auth.digest.Mac(
      key, secret)
    const config = new qiniu.conf.Config
    this.bucketManager = new qiniu.rs.BucketManager(mac, config)
    this.bucket = bucket
    this.prefix = prefix
  }

  cleanIfNot (name, days=7, marker=undefined) {
    if (!name || name.length < min) {
      throw new Error(`前缀至少需要${min}`)
    }

    this.bucketManager.listPrefix(this.bucket, {
      prefix: this.prefix,
      marker: marker,
      limit: 1000
    }, (err, respBody, respInfo) => {
      if (err) {
        throw err
      }
      if (respInfo.statusCode === 200) {
        const items = respBody.items
        const operations = items.reduce((operations, item) => {
          const pathParts = item.key.split('/')
          const second = pathParts[1]
          if (second && second !== name) {
            if (days > 0) {
              operations.push(qiniu.rs.deleteAfterDaysOp(
                this.bucket, item.key, days))
            } else if (days === 0) {
              operations.push(qiniu.rs.deleteOp(
                this.bucket, item.key))
            }
          }
          return operations
        }, [])

        const nextMarker = respBody.marker
        if (operations.length > 0) {
          this.bucketManager.batch(operations, (err, respBody, respInfo) => {
            if (err) {
              throw err
            }
            if (parseInt(respInfo.statusCode / 100) === 2) {
              if (nextMarker) {
                this.cleanIfNot(name, days, nextMarker)
              }
            } else {
              throw new Error(JSON.stringify(respBody))
            }
          })
        } else {
          if (nextMarker) {
            this.cleanIfNot(name, days, nextMarker)
          }
        }
      } else {
        throw new Error(respBody)
      }
    })
  }
}

module.exports = function ({
  key,
  secret,
  bucket,
  prefix,
  name,
  days=7
}) {
  const cleaner = new QiniuCleaner({
    key,
    secret,
    bucket,
    prefix
  })
  cleaner.cleanIfNot(name, days)
}
