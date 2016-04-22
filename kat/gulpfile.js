const gulp = require('gulp');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');

var files = ['lib**/*.js', 'test/**/*.js', 'routes/**/*.js', 'models/**/*.js', 'gulpfile.js', 'server.js'];


gulp.tack('lint', () => {
  return gulp.src(files)
  .pipe(eslint({
    envs: [
      'mocha',
      'es6'
    ]
  }))
  .pipe(eslint.format());
});

gulp.task('mocha', () => {
  return gulp.src('./test**/*test.js')
  .pipe(mocha());
});

gulp.task('default', ['lint', 'mocha']);
