var test = require('tape')
var hyperdrive = require('hyperdrive')
var memdb = require('memdb')
var pump = require('pump')
var tar = require('tar-stream')

var tarDat = require('.')

test('puts tar into archive', function (t) {
  var pack = tar.pack()
  var drive = hyperdrive(memdb())
  var archive = drive.createArchive()

  pack.entry({ name: 'my-test.txt' }, 'Hello World!')
  pack.finalize()

  pump(pack, tarDat(archive), function (err) {
    t.error(err)
    archive.finalize(function (err) {
      t.error(err)
      t.ok(archive.key.toString('hex'), 'key made')
      archive.get(0, function (err, entry) {
        t.error(err)
        t.ok(entry.name === 'my-test.txt', 'has file')
        t.end()
      })
    })
  })
})
