var tar = require('tar-stream')
var hyperdrive = require('hyperdrive')
var memdb = require('memdb')
var swarm = require('hyperdrive-archive-swarm')
var pump = require('pump')
var tarDat = require('.')

var pack = tar.pack()
var drive = hyperdrive(memdb())
var archive = drive.createArchive()

pack.entry({ name: 'my-test.txt' }, 'Hello World!')
pack.finalize()

pump(pack, tarDat(archive), function (err) {
  if (err) return console.error(err)
  archive.finalize(function (err) {
    if (err) return console.error(err)
    console.log('key: ', archive.key.toString('hex'))
    swarm(archive)
  })
})
