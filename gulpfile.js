'use strict';
const gulp = require('gulp');
const pug = require('gulp-pug');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();
var sass = require('gulp-sass');

sass.compiler = require('node-sass');

gulp.task('dell',function(){
	return del('site/**');
})

gulp.task('pug',function(){
	return gulp.src('src/pug/pages/**/*.pug')
	.pipe(pug({
		pretty:true
	}))
	.pipe(gulp.dest('site'))
	.on('end', browserSync.reload);
})

gulp.task('sass', function(){
	return gulp.src('src/sass/**/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('styles.css'))
	.pipe(autoprefixer({
    //  browsers: ['last 2 versions'],
      cascade: false
   }))
   // .pipe(cleanCSS({
   //    level: 2
   // }))
    .pipe(gulp.dest('site/css'))
	.on('end', browserSync.reload);
})

gulp.task('js',function(){
	return gulp.src('src/js/**/*.js')
	.pipe(concat('script.js'))
	.pipe(gulp.dest('site'))
	.on('end', browserSync.reload);
})

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: "./site"
        }
    });
});

gulp.task('watch',function(){
	gulp.watch('src/pug/**/*.pug',gulp.series('pug'));
	gulp.watch('src/sass/**/*.sass',gulp.series('sass'));
	gulp.watch('src/js/**/*.js',gulp.series('js'));
})

gulp.task('default',gulp.series(
	'dell',
	gulp.parallel('pug','sass','js'),
	gulp.parallel('watch','browserSync')
	)
)