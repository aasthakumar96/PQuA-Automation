const fs = require('fs')
const gulp = require('gulp')
const path = require('path')

fs.readdirSync('./gulp').forEach(function (file) {
  module.exports[path.basename(file, '.js')] = require('./gulp/' + file)
})

const { compile, watch } = module.exports.js
const { startServer } = module.exports.server

const serve = gulp.series(compile, startServer)
serve.description = 'serve compiled source on local server'

const defaultTasks = gulp.parallel(serve, watch)

module.exports.build = compile
module.exports.watch = watch
module.exports.default = defaultTasks
