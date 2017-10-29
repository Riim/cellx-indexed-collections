let gulp = require('gulp');
let sizereport = require('gulp-sizereport');

gulp.task('sizereport', () => {
	return gulp.src('dist/**/*').pipe(
		sizereport({
			total: false,
			gzip: true
		})
	);
});
