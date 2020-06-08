const gulp = require('gulp');
const minify = require('gulp-minify');

gulp.task('ext-script', () => {
	return gulp.src('./src/background.js')
		.pipe(minify({
			noSource: true,
			ext: {
				min: '.min.js'
			}
		}))
		.pipe(gulp.dest('./chrome-extension'))
})
