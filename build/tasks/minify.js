let pump = require('pump');
let gulp = require('gulp');
let uglify = require('gulp-uglify');
let rename = require('gulp-rename');

gulp.task('minify', done => {
	pump(
		[gulp.src('dist/index.js'), uglify(), rename({ suffix: '.min' }), gulp.dest('dist')],
		done
	);
});
