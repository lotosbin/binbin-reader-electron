/**
 * Created by liubinbin on 2016/8/21.
 */
var gulp = require('gulp');

gulp.task('copy', function () {
  return gulp.src('src/index.{html,css}').pipe(gulp.dest('dist'));
})
gulp.task('watch',function () {
  gulp.watch('src/index.{html,css}',['copy'])
})
gulp.task('default', ['copy'])
