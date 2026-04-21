const { src, dest, watch, series, parallel } = require("gulp"),
	imagemin = require("gulp-imagemin"),
	sourcemaps = require("gulp-sourcemaps"),
	sass = require("gulp-sass")(require("sass")),
	concat = require("gulp-concat"),
	terser = require("gulp-terser"),
	postcss = require("gulp-postcss"),
	autoprefixer = require("autoprefixer"),
	browserSync = require("browser-sync").create(),
	cssnano = require("cssnano");

/** Paths and Variables */
const srcPath = "src/",
	distPath = "dist/",
	assetsScssPath = "src/assets/scss/",
	assetsJsPath = "src/assets/js/";

// Source Files Variables
const srcFiles = {
	htmlFiles: srcPath + "*.html",
	CSSFiles: srcPath + "css/**/*.{css,css.map}",
	fontsFiles: srcPath + "fonts/**/*.{ttf,woff,eot,svg,gif}",
	imagesFiles: srcPath + "img/**/*",
	jsFiles: srcPath + "js/**/*.js",
};

// Assets Files Variables
const assetsFiles = {
	scssFiles: ["node_modules/aos/dist/aos.css", assetsScssPath + "**/*.scss"],
	jsFiles: [
		"node_modules/jquery/dist/jquery.min.js",
		"node_modules/slick-carousel/slick/slick.js",
		"node_modules/aos/dist/aos.js",
		assetsJsPath + "index.js",
	],
};

// Source Paths Variables
const srcPaths = {
	CSSPath: srcPath + "css",
	jsPath: srcPath + "js",
};

// Distributable Paths Variables
const distPaths = {
	htmlPath: distPath,
	CSSPath: distPath + "css",
	fontsPath: distPath + "fonts",
	ImagesPath: distPath + "img",
	jsPath: distPath + "js",
};

/** Tasks */

// Compiling
function scssCompile() {
	return src(assetsFiles.scssFiles)
		.pipe(sourcemaps.init())
		.pipe(sass().on("error", sass.logError))
		.pipe(postcss([autoprefixer(), cssnano()]))
		.pipe(concat("main.css"))
		.pipe(sourcemaps.write("."))
		.pipe(dest(srcPaths.CSSPath))
		.pipe(browserSync.stream());
}

function jsCompile() {
	return src(assetsFiles.jsFiles)
		.pipe(sourcemaps.init())
		.pipe(terser())
		.pipe(concat("all.js"))
		.pipe(sourcemaps.write("."))
		.pipe(dest(srcPaths.jsPath));
}

// Copying files to dist/ folder
function copyHTML() {
	return src(srcFiles.htmlFiles).pipe(dest(distPaths.htmlPath));
}

function copyCSS() {
	return src(srcFiles.CSSFiles).pipe(dest(distPaths.CSSPath));
}

function copyJS() {
	return src(srcFiles.jsFiles).pipe(dest(distPaths.jsPath));
}

function copyFonts() {
	return src(srcFiles.fontsFiles).pipe(dest(distPaths.fontsPath));
}

function copyImages() {
	return src(srcFiles.imagesFiles).pipe(imagemin()).pipe(dest(distPaths.ImagesPath));
}

// Watch
function watchMe() {
	browserSync.init({
		server: {
			baseDir: "./src/",
		},
	});
	watch(assetsFiles.scssFiles, scssCompile);
	watch(assetsFiles.jsFiles, jsCompile).on("change", browserSync.reload);
	watch(srcFiles.htmlFiles).on("change", browserSync.reload);
	watch(srcFiles.imagesFiles).on("change", browserSync.reload);
}

/** Exports */
exports.copyHTML = copyHTML;
exports.scssCompile = scssCompile;
exports.jsCompile = jsCompile;
exports.copyCSS = copyCSS;
exports.copyJS = copyJS;
exports.copyFonts = copyFonts;
exports.copyImages = copyImages;
exports.watchMe = watchMe;

exports.build = series(copyHTML, copyCSS, copyJS, copyFonts, copyImages);
exports.default = series(scssCompile, jsCompile, watchMe);
