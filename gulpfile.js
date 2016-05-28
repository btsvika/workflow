/*
 --save-dev
 put in package.json the Dependencies under devDependencies

 to see the gulp tool window in WebStorm do the following:
 1. run a couple of gulp tasks in the terminal
 2. Alt + F11 and choose the gulpfile.js file
 3. restart WebStorm
 4. Go to: View -> Tool Window -> Gulp

 */
/*
* setting the project in a new folder
  * 1. go to the github and copy the git url (for example: https://github.com/btsvika/workflow.git)
  * 2. open git bash
  * 3. write cd PATH_TO_THE_FOLDER that you want the project to be in
  * 4. write git clone https://github.com/btsvika/workflow.git
  * 5. open the project with WebStorm
  * 6. open terminal of WebStorm and write npm install
  * 7. copy the images folder to the development and production folders
  * 8. run gulp :)
* */



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
//npm install --save-dev gulp-jsonminify
    jsonminify = require('gulp-jsonminify');
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
//NOTE: in windows, in order to run as production -> in the terminal write: set NODE_ENV=development
//and than run gulp

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
    gulp.watch('builds/development/js/*.json', ['json']);
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
    gulp.src('builds/development/js/*.json')
        .pipe(gulpif(env === 'production', jsonminify()))
        .pipe(gulpif(env === 'production', gulp.dest('builds/production/js')))
        .pipe(connect.reload())
});

//https://github.com/gulpjs/gulp/blob/master/docs/API.md
gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'connect', 'watch']);