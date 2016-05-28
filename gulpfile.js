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
//npm install --save-dev gulp-if
    gulpif = require('gulp-if'),
//npm install --save-dev gulp-uglify
    uglify = require('gulp-uglify'),
//npm install --save-dev gulp-minify-html
    minifyHTML = require('gulp-minify-html'),
//npm install --save-dev gulp-concat
    concat = require('gulp-concat');

var env,
    coffeeSources,
    jsSources,
    sassSources,
    htmlSources,
    jsonSources,
    outputDir,
    sassStyle,
    sassStyleComments;

env = process.env.NODE_ENV || 'development';
//env = 'production';

if (env==='development') {
    outputDir = 'builds/development/';
    sassStyle = 'expended';
    sassStyleComments = true;
} else {
    outputDir = 'builds/production/';
    sassStyle = 'compressed';
    sassStyleComments = false;
}

coffeeSources = ['components/coffee/tagline.coffee'];
jsSources = [
    'components/scripts/rclick.js',
    'components/scripts/pixgrid.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js'
];
sassSources = ['components/sass/style.scss'];
htmlSources = [outputDir + '*.html'];
jsonSources = [outputDir + 'js/*.json'];

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
        .pipe(gulpif(env === 'production', uglify()))
        //browserify() added the first line in scripts.js and jquery + mustache
        .pipe(gulp.dest(outputDir + 'js'))
        .pipe(connect.reload())
});

//https://www.npmjs.com/package/gulp-compass
gulp.task('compass', function () {
    gulp.src(sassSources)
        .pipe(compass({
            sass: 'components/sass',
            image: outputDir + 'images',
            style: sassStyle,
            comments: sassStyleComments,
            lineNumbers: sassStyleComments

        })
            .on('error', gutil.log))
        .pipe(gulp.dest(outputDir + 'css'))
        .pipe(connect.reload())
});

gulp.task('watch', function () {
    gulp.watch(coffeeSources, ['coffee']);
    gulp.watch(jsSources, ['js']);
    gulp.watch('components/sass/*.scss', ['compass']);
    gulp.watch('builds/development/*.html', ['html']);
    gulp.watch(jsonSources, ['json']);
});

gulp.task('connect', function () {
    connect.server({
        root: outputDir,
        livereload: true
    })
});

gulp.task('html', function () {
    gulp.src('builds/development/*.html')
        .pipe(gulpif(env === 'production', minifyHTML()))
        .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
        .pipe(connect.reload())
});

gulp.task('json', function () {
    gulp.src(jsonSources)
        .pipe(connect.reload())
});

//https://github.com/gulpjs/gulp/blob/master/docs/API.md
gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'watch']);