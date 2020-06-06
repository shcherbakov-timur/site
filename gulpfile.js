const gulp = require('gulp');
const sass = require('gulp-sass');
const pug = require('gulp-pug');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();

function dell() {
   return del(['ege-planet/*']);
}

function browser_Sync() {
  browserSync.init({
      server: {
          baseDir: "ege-planet"
      }
  });
}

function css() {
   return gulp.src("src/sass/**/*.sass")
   .pipe(sass().on('error', sass.logError))
   //Объединение файлов в один
   .pipe(concat('style.css'))
   //Добавить префиксы
   .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
   }))
   //Минификация CSS
   .pipe(cleanCSS({
      level: 2
   }))
   //Выходная папка для стилей
   .pipe(gulp.dest('ege-planet/css'));
}

function html() {
	return gulp.src("src/pug/pages/**/*.pug")
	.pipe(pug())
	.pipe(gulp.dest("ege-planet"));
}

function scripts() {
   //Шаблон для поиска файлов JS
   //Всей файлы по шаблону 'src/js/**/*.js'
   return gulp.src("src/js/**/*.js")
   //Объединение файлов в один
   .pipe(concat('script.js'))
   //Минификация JS
   // .pipe(uglify({
   //    toplevel: true
   // }))
   //Выходная папка для скриптов
   .pipe(gulp.dest('ege-planet/js'));
}

function watch_reload(){
  //Следить за CSS файлами
  gulp.watch('src/sass/**/*.scss', css).on('change', browserSync.reload);
  //Следить за JS файлами
  gulp.watch('src/js/**/*.js', scripts).on('change', browserSync.reload);
  //При изменении HTML запустить синхронизацию
  gulp.watch("src/**/*.pug", html).on('change', browserSync.reload);
}

gulp.task('default', gulp.series(
	dell,
	gulp.parallel(html,css,scripts),
	gulp.parallel(browser_Sync, watch_reload)
));