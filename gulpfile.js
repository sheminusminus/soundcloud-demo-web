var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var nodemon = require('gulp-nodemon');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');


gulp.task('browser-sync', ['nodemon','styles'], function() {
  browserSync({
    proxy: "localhost:3000",  // local node app address
    port: 5000,  // use *different* port than above
    notify: true
  });
});



gulp.task('nodemon', function (cb) {
  var called = false;
  return nodemon({
    script: 'app.js',
    ignore: [
      'client/',
      'node_modules/'
    ]
  })
  .on('start', function () {
    if (!called) {
      called = true;
      cb();
    }
  })
  .on('restart', function () {
    setTimeout(function () {
      reload({ stream: false });
      console.log("Server Restart")
    }, 1000);
  });
});


gulp.task('styles', function() {
    return gulp.src('client/scss/**/*.scss')
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(gulp.dest('client/public/css/'))
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('.', {
           sourceRoot: function(file){ return file.cwd + 'client/public/css/'; }
        }))
        .pipe(gulp.dest('client/public/css/'))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('default', ['browser-sync'], function () {
  gulp.watch(['client/**/*.html'], reload);
  gulp.watch('client/scss/**/*.scss',['styles']);
  gulp.watch('client/**/*.js',reload);
});
