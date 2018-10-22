var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var typedoc = require("gulp-typedoc");

gulp.task("default", function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist"));
});

gulp.task('watch',function(){
  gulp.watch('./src/**/*',['default']);
  gulp.watch('./test/**/*',['default']);
});

gulp.task("doc", function() {
    return gulp
      .src(["src/**/*.ts"])
      .pipe(typedoc({
          module: "commonjs",
          target: "es2015",
          out: "docs/",
          name: "DMR Middleware",
          hideGenerator: true,
          version: false,
          theme: "minimal", // markdown | minimal | default
          mode: "file",
          exclude: ['src/index.ts'],
          excludePrivate: true,
          excludeProtected: true,
          help: false,
          readme: "README.md"
      }));
});
