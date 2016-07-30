const ts = require('gulp-typescript');
const istanbul = require('gulp-istanbul');
const mocha = require('gulp-mocha');
const gulp = require('gulp');
const remapIstanbul = require('remap-istanbul/lib/gulpRemapIstanbul');

gulp.task('default', function() {
	return gulp.src('src/**/*.ts')
		.pipe(ts({
			noImplicitAny: true,
			noImplicitReturns: true,
		}))
		.js.pipe(gulp.dest("dist"));
});

gulp.task('pre-test', function () {
	return gulp.src(['dist/**/*.js'])
	// Covering files
		.pipe(istanbul())
	// Force `require` to return covered files
		.pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function () {
	return gulp.src(['test/*.js'])
		.pipe(mocha())
	// Creating the reports after tests ran
		.pipe(istanbul.writeReports())
	// Enforce a coverage of at least 90%
		.pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }))
		.pipe(remapIstanbul({
			reports: {
				'json': 'coverage.json',
				'html': 'html-report'
			}
		}));
});
