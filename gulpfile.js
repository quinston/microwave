const ts = require('gulp-typescript');
const istanbul = require('gulp-istanbul');
const mocha = require('gulp-mocha');
const gulp = require('gulp');
const remapIstanbul = require('remap-istanbul/lib/gulpRemapIstanbul');
const sourcemaps = require('gulp-sourcemaps')

const tsOptions = {
	noImplicitAny: true,
	noImplicitReturns: true,
	noEmitOnError: true,
	module: "commonjs",
	target: "es6",
}; 

gulp.task('default', function() {
	return gulp.src(['src/**/*.ts'])
		.pipe(sourcemaps.init())
		.pipe(ts(tsOptions))
		.js
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('dist'))
});

gulp.task('pre-test', ['default'], function () {
	return gulp.src(['dist/!(tests)/**/*.js', 'dist/*.js'])
	// Covering files
		.pipe(istanbul())
	// Force `require` to return covered files
		.pipe(istanbul.hookRequire());
});

gulp.task('reports', ['pre-test'], function () {

	return gulp.src('dist/tests/**/*.js')
		.pipe(mocha())
		.pipe(istanbul.writeReports({
			'reporters': ['lcovonly', 'json']
		}))
		.pipe(istanbul.enforceThresholds({ thresholds: { global: 95 } }))
});

gulp.task('test', ['reports'], function() {
	return gulp.src(['coverage/coverage-final.json'])
			.pipe(remapIstanbul({
				reports: {
					'json': 'coverage/coverage-remapped.json',
					'html': 'coverage/lcov-report',
					'text': null
				}
			}))
});
