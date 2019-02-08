const fs = require('fs');
const Path = require('path');
const gulp = require('gulp');
const include = require('gulp-include');
const connect = require('gulp-connect');
const uglify = require('gulp-uglify-es').default;
const mo3 = require('mo3place')();
const through = require('through2');
const sass = require('node-sass');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const env = require('minimist')(process.argv.slice(2));
if (!env.publish) { env.jst = env.imgt = env.csst = '1'; }


function assets() {
    countryCode = env.option;
    return gulp.src(['src/img/**', 'src/font/*.*', 'src/js/languages/' + countryCode + '.json'], { base: 'src' })
        .pipe(gulp.dest('www'));
}

function scripts() {
    countryCode = env.option;
    return gulp.src(['node_modules/history/umd/history.js','node_modules/floatthead/src/jquery.floatThead.js','src/js/data/'+ countryCode +'.js','src/js/adapter.js' ,'src/js/currency.js',
        'src/js/tools.js', 'src/js/main.js', 'src/js/route.js'])
        .pipe(through.obj((file, enc, cb) => {
            mo3.render(file, env);
            cb(null, file);
        }))
        .pipe(sourcemaps.init())
        .pipe(concat('all.js'))
        .pipe(sourcemaps.write())
        .pipe(uglify())
        .pipe(gulp.dest('www/js/'));
}

function css() {
    return gulp.src(['src/css/*.scss'])
        .pipe(through.obj((file, enc, cb) => {
            file.contents = sass.renderSync({ data: file.contents.toString() }).css;
            file.path = file.path.slice(0, -4) + 'css';
            cb(null, file);
        }))
        .pipe(gulp.dest('www/css/'))
        .pipe(connect.reload());
}

function html() {
    return gulp.src(['src/*.html'])
        .pipe(through.obj((file, enc, cb) => {
            mo3.render(file, env);
            if (file.path.substring(__dirname.length) === '/src/index.html') {
                file.stat.mtime = fs.statSync('www/js/all.js').mtime;
            }
            cb(null, file);
        }))
        .pipe(gulp.dest('www'))
        .pipe(connect.reload());
}

gulp.task('sitemap', (cb) => {
    const index = JSON.parse(fs.readFileSync('./i18n/index.json')).no;
    let map = '<?xml version="1.0" encoding="UTF-8"?><urlset ' +
    'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

    for (const x in index) {
        const o = index[x];
        if (o.hidden) { continue; }
        let path = o.url.substring(o.url.indexOf('/'));
        path += (path.slice(-1) === '/') ? 'index.html' : '.html';
        const stat = fs.statSync(Path.join(__dirname, 'www', path));
        map += '<url><loc>https://' + o.url + '</loc>';
        map += '<lastmod>' + stat.mtime.toISOString() + '</lastmod></url>';
    }
    map += '</urlset>';
    const fd = fs.openSync(Path.join(__dirname, 'www', 'sitemap.xml'), 'w');
    fs.writeSync(fd, map);
    fs.closeSync(fd);
    cb(null);
});

gulp.task('serve', () => {
    connect.server({ root: 'www',host:'0.0.0.0' ,livereload: true, port: env.port || 8080});
    gulp.watch(['src/img/**', 'src/font/*'], assets);
    gulp.watch(['src/*.html'], html);
    gulp.watch(['src/css/*.scss'], gulp.series(css));
    gulp.watch(['src/js/**/*.js'], gulp.series(scripts, html));
});

gulp.task('build', gulp.series(assets, scripts, css, html, 'sitemap'));
gulp.task('default', gulp.series('build', 'serve'));
