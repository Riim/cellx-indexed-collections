let gulp = require('gulp');
let runSequence = require('run-sequence');

gulp.task('default', done => {
	runSequence('minify', 'sizereport', done);
});
