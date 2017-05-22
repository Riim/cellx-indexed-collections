var gulp = require('gulp');
var replace = require('gulp-replace');

gulp.task('fix-global', function() {
	return gulp.src('dist/index.js')
		.pipe(replace(
			'(global.cellxIndexedCollections = ',
			"(global.cellxIndexedCollections = global['cellx-indexed-collections'] = "
		))
		.pipe(gulp.dest('dist'));
});
