const concat = require('gulp-concat')
const constants = require('../utils/constants.js')
const gulp = require('gulp')
const nodemon = require('gulp-nodemon')
const ngAnnotate = require('gulp-ng-annotate')
const merge = require('merge-stream');
const plumber = require('gulp-plumber')
const uglify = require('gulp-uglify')

const compileMarkup = () => {
    return gulp.src('./resources/*.json')
        .pipe(gulp.dest('./public/resources'))
}

const compileScript = () => {
    let compileJs = gulp.src(['ng/languages.js','ng/**/module.js', 'ng/**/*.js'])
        .pipe(plumber())
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(concat('app.js'))
        .pipe(gulp.dest('public' + constants.API_PREFIX))

    let compileLibs = gulp.src(['libs/**/*'])
        .pipe(gulp.dest('public' + constants.API_PREFIX))

    return merge(compileJs, compileLibs)
}

const compile = gulp.parallel(compileMarkup, compileScript)
compile.description = 'compile all sources'

const watchScript = () => {
    return gulp.watch('ng/**/*.js', compile);
}

const watch = gulp.parallel(watchScript)
watch.description = 'watch for changes to all source'

module.exports.compile = compile
module.exports.watch = watch
