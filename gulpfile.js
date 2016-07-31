const ts = require('gulp-typescript');
const istanbul = require('gulp-istanbul');
const mocha = require('gulp-mocha');
const gulp = require('gulp');
const remapIstanbul = require('remap-istanbul/lib/gulpRemapIstanbul');
const sourcemaps = require('gulp-sourcemaps')

const tsOptions = {
	noImplicitAny: true,
	noImplicitReturns: true,
	module: "commonjs",
	target: "es6",
}; 

gulp.task('default', function() {
	return gulp.src(['src/**/*.ts'])
		.pipe(sourcemaps.init())
		.pipe(ts(tsOptions))
		.js
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('dist'));
});

gulp.task('pre-test', function () {
	return gulp.src(['dist/**/*.js'])
	// Covering files
		.pipe(istanbul())
	// Force `require` to return covered files
		.pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function () {
	gulp.src(['src/tests/**/*.ts'])
		.pipe(ts(tsOptions))
		.js.pipe(gulp.dest('dist/tests'))
		.pipe(mocha())
	// Creating the reports after tests ran
		.pipe(istanbul.writeReports())
	// Enforce a coverage of at least 90%
		.pipe(istanbul.enforceThresholds({ thresholds: { global: 95 } }));

	return gulp.src('coverage/coverage-final.json')
		.pipe(remapIstanbul({
			reports: {
				'json': 'coverage/coverage-remapped.json',
				'html': 'coverage/html-report'
			}
		}));
});
