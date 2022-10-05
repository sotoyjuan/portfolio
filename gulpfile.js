const { src, dest, series, task, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const browserSync = require('browser-sync').create();

// File paths
const files = {
	scssPath: 'src/styles/index.scss',
	jsPath: 'src/scripts/index.js',
};

// Sass task: compiles the index.scss file into index.css
function scssTask() {
	return src(files.scssPath, { sourcemaps: true })
		.pipe(sass())
		.pipe(postcss([autoprefixer(), cssnano()]))
		.pipe(dest('dist', { sourcemaps: '.' }));
}

// JS task: concatenates and uglifies JS files to index.js
function jsTask() {
	return src([files.jsPath], {sourcemaps: true})
		.pipe(concat('index.js'))
		.pipe(terser())
		.pipe(dest('dist', { sourcemaps: '.' }));
}

/**
 * Gulp Tasks
 */
task('sass', (done) => {
    scssTask();
    done();

});

task('js', (done) => {
    jsTask();
    done();
});

task('sass-watch', (done) => {
	scssTask();
	done();
})

task('js-watch', (done) => {
	jsTask();
	done();
})

task('server', (done) => {
	browserSync.init({
		proxy: 'localhost:8080',
		open: false
	})

	// SCSS watch
	watch('src/styles/**/*.scss')
		.on('change', series('sass-watch', browserSync.reload));
	// JS watch
	watch('src/scripts/**/*.js')
	.on('change', series('js-watch', browserSync.reload));

	// HTML, .yaml reloading the browser.
	watch(['views/**/*.html',
	'content/**/*.yaml']).on('change', browserSync.reload);

	done();
});

// Default Task
task('default', series('sass', 'js', 'server'));
