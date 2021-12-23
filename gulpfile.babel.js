import gulp from "gulp";
import compiler from "sass";
import sass from "gulp-sass";
import pug from "gulp-pug";
import { init as server, reload, stream } from "browser-sync";

const { src, dest, watch, series } = gulp;

const reloadBrowser = (done) => {
  reload();
  done();
};

const pugTask = () => {
  return src("./src/views/pages/*.pug")
    .pipe(pug({ pretty: true }))
    .pipe(dest("./public/"));
};

const sassTask = () => {
  return src("./src/sass/styles.scss")
    .pipe(sass(compiler)({ outputStyle: "expanded" }))
    .pipe(dest("./public/css/"))
    .pipe(stream());
};

const generateServer = () => {
  server({ server: "./public", port: 5500 });
};

const watching = () => {
  generateServer();
  watch("./src/views/**/*.pug", series(pugTask));
  watch("./src/sass/**/*.scss", series(sassTask));
  watch(["./public/*.html", "./public/js/*js"], series(reloadBrowser));
};

export { watching, pugTask as pug, sassTask as sass };
