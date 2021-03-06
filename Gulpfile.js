let gulp = require('gulp');
let sass = require('gulp-sass');
let pug = require('gulp-pug');
let prettify = require('gulp-html-prettify');
let autoprefixer = require('gulp-autoprefixer');
let exec = require('gulp-exec');
let cleanCSS = require('gulp-clean-css');
let rename = require('gulp-rename');
let connect = require('gulp-connect');
let cleanCssJson = require('./json/parseCssJson');

gulp.task('connect', function() {
    connect.server({
        root: './docs',
        livereload: {
            port: 35730
        }
    });
});

gulp.task('styles', function() {
    gulp.src('./scss/elassus.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'IE 11'],
            cascade: false
        }))
        .pipe(gulp.dest('./css/'))
        .pipe(gulp.dest('./docs/css/'))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./css/'))
        .pipe(gulp.dest('./docs/css/'))
        .pipe(connect.reload());
});

gulp.task('json', function() {
    gulp.src('./json/modules.scss')
        .pipe(sass({ includePaths: './scss' }).on('error', sass.logError))
        .pipe(gulp.dest('./json'))
        .pipe(cleanCssJson({
            src: './json/modules.css',
            dest: './docs/css.json'
        }));
});

gulp.task('pug', function buildHTML() {
    return gulp.src(['pug/**/*.pug', '!**/includes/**'])
        .pipe(pug())
        .pipe(prettify({ indent_char: ' ', indent_size: 4 }))
        .pipe(gulp.dest('./docs'))
        .pipe(connect.reload());
});

gulp.task('watch', function() {
    gulp.watch(['./scss/**/*.scss'], ['styles']);
    gulp.watch(['./pug/**/*.pug'], ['pug']);
});

//Watch task
gulp.task('default', ['styles', 'pug', 'connect', 'watch']);
