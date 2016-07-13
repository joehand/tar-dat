var debug = require('debug')('tar-dat')
var tar = require('tar-stream')

module.exports = function (archive) {
  var extract = tar.extract()

  extract.on('entry', function (header, stream, next) {
    debug('extract', header)
    var ws = archive.createFileWriteStream(header.name)
    stream.pipe(ws)
    stream.on('end', function () {
      next()
    })
    stream.resume()
  })

  extract.on('finish', function () {
    // ??
  })

  return extract
}
