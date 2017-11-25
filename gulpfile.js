const browserify = require('browserify'),
    concat = require('gulp-concat'),
    gulp = require('gulp'),
    insert = require('gulp-insert'),
    eslint = require('gulp-eslint'),
    karma = require('karma'),
    package = require('./package.json'),
    path = require('path'),
    replace = require('gulp-replace'),
    source = require('vinyl-source-stream'),
    streamify = require('gulp-streamify'),
    uglifyes = require('uglify-es'),
    composer = require('gulp-uglify/composer');

const uglify = composer(uglifyes, console);

const srcDir = './src/';
const srcFiles = srcDir + '**.js';
const buildDir = './build/';

const header = "/*!\n\
 * chartjs-chart-boxplot\n\
 * Version: {{ version }}\n\
 *\n\
 * Copyright 2017 Datavisyn GmbH\n\
 * Released under the MIT license\n\
 * https://github.com/datavisyn/chartjs-chart-boxplot/blob/master/LICENSE.md\n\
 */\n";

gulp.task('default', ['build', 'lint', 'watch']);
gulp.task('build', buildTask);
gulp.task('lint', lintTask);
gulp.task('watch', watchTask);
gulp.task('test', testTask);

function buildTask() {
    return browserify('./src/index.js')
        .ignore('chart.js')
        .bundle()
        .pipe(source('Chart.BoxPlot.js'))
        .pipe(insert.prepend(header))
        .pipe(streamify(replace('{{ version }}', package.version)))
        .pipe(gulp.dest(buildDir))
        .pipe(streamify(uglify()))
        .pipe(streamify(concat('Chart.BoxPlot.min.js')))
        .pipe(gulp.dest(buildDir));

}

function watchTask() {
    return gulp.watch(srcFiles, ['build', 'lint']);
}

function lintTask() {
    return gulp.src(srcFiles)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
}

function startTest() {
    return [
        './test/jasmine.index.js',
        './src/**/*.js',
    ].concat(
        ['./test/specs/**/*.js']
    );
}

function runTest(done, singleRun) {
    new karma.Server({
        configFile: path.join(__dirname, 'karma.conf.js'),
        files: startTest(),
        singleRun: singleRun
    }, done).start();
}

function testTask(done) {
    runTest(done, true);
}
