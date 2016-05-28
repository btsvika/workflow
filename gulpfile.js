/*
 --save-dev
 put in package.json the Dependencies under devDependencies

 to see the gulp tool window in WebStorm do the following:
 1. run a couple of gulp tasks in the terminal
 2. Alt + F11 and choose the gulpfile.js file
 3. restart WebStorm
 4. Go to: View -> Tool Window -> Gulp

 */

//npm install --save-dev gulp
var gulp = require('gulp'),
//npm install --save-dev gulp-util
    gutil = require('gulp-util'),
//npm install --save-dev gulp-coffee
    coffee = require('gulp-coffee'),
//npm install --save-dev mustache
//npm install --save-dev jquery
//npm install --save-dev gulp-browserify
    browserify = require('gulp-browserify'),
//npm install --save-dev gulp-compass
    compass = require('gulp-compass'),
//npm install --save-dev gulp-connect
    connect = require('gulp-connect'),
//npm install --save-dev gulp-concat
    concat = require('gulp-concat');

var coffeeSources = ['components/coffee/tagline.coffee'];
//var coffeeSources = ['components/coffee/*.coffee'] - for all the files
var jsSources = [
    'components/scripts/rclick.js',
    'components/scripts/pixgrid.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js'
];
var sassSources = ['components/sass/style.scss'];


gulp.task('coffee', function () {
    gulp.src(coffeeSources)
        .pipe(coffee({bare: true})
            .on('error', gutil.log))
        .pipe(gulp.dest('components/scripts'))
});

gulp.task('js', function () {
    gulp.src(jsSources)
        .pipe(concat('script.js'))
        .pipe(browserify())
        //browserify() added the first line in scripts.js and jquery + mustache
        .pipe(gulp.dest('builds/development/js'))
        .pipe(connect.reload())
});

//https://www.npmjs.com/package/gulp-compass
gulp.task('compass', function () {
    gulp.src(sassSources)
        .pipe(compass({
            sass: 'components/sass',
            image: 'builds/development/images',
            style: 'expanded',
            comments: true,
            lineNumbers: true

        })
            .on('error', gutil.log))
        .pipe(gulp.dest('builds/development/css'))
        .pipe(connect.reload())
});

gulp.task('watch', function () {
    gulp.watch(coffeeSources, ['coffee']),
    gulp.watch(jsSources, ['js']),
    gulp.watch('components/sass/*.scss', ['compass'])
});

gulp.task('connect', function () {
    connect.server({
        root: 'builds/development/',
        livereload: true
    })
});

//https://github.com/gulpjs/gulp/blob/master/docs/API.md
gulp.task('default', ['coffee', 'js', 'compass', 'connect', 'watch']);