const gulp = require('gulp')
const nodemon = require('gulp-nodemon')

// Not exposed to CLI
const startServer = () => {
    nodemon({
        script: 'server.js',
        ext: 'js',
        ignore: ['ng*', 'gulp*', 'public*']
    })
}

module.exports.startServer = startServer
