// ==========================================
// KARMA + JASMINE
// ==========================================
// Ejecuta las pruebas src/specs/*.spec.js en un navegador real (Chrome o Edge sin ventana).
// esbuild compila el JSX y el plugin de Istanbul instrumenta el código para medir cobertura.
//
//   npm run test:karma          -> una corrida con reporte de cobertura en coverage/karma
//   npm run test:karma:watch    -> deja Karma escuchando cambios
const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");
const { createInstrumenter } = require("istanbul-lib-instrument");

// Usa Chrome si está instalado; si no, Edge (viene con Windows y también es Chromium).
if (!process.env.CHROME_BIN) {
  const candidatos = [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium"
  ];
  const encontrado = candidatos.find((ruta) => fs.existsSync(ruta));
  if (encontrado) process.env.CHROME_BIN = encontrado;
}

// Plugin de esbuild que instrumenta con Istanbul solo el código de la app
// (no las pruebas ni node_modules) para que karma-coverage pueda medir la cobertura.
const instrumentador = createInstrumenter({ esModules: true, produceSourceMap: false });
const esCodigoApp = (ruta) => {
  const r = ruta.replace(/\\/g, "/");
  return r.includes("/src/") && !r.includes("/node_modules/") && !r.includes("/src/specs/") &&
    !r.includes("/src/test/") && !/\.(test|spec)\.jsx?$/.test(r);
};
const pluginCobertura = {
  name: "cobertura-istanbul",
  setup(build) {
    build.onLoad({ filter: /\.jsx?$/ }, async ({ path: ruta }) => {
      if (!esCodigoApp(ruta)) return undefined;
      const fuente = await fs.promises.readFile(ruta, "utf8");
      const { code } = await esbuild.transform(fuente, { loader: "jsx", jsx: "automatic", format: "esm", sourcefile: ruta });
      return { contents: instrumentador.instrumentSync(code, ruta), loader: "js", resolveDir: path.dirname(ruta) };
    });
  }
};

module.exports = function (config) {
  config.set({
    frameworks: ["jasmine"],
    files: [{ pattern: "src/specs/**/*.spec.js", watched: true }],
    preprocessors: { "src/specs/**/*.spec.js": ["esbuild"] },

    esbuild: {
      jsx: "automatic",
      target: "es2020",
      sourcemap: true,
      define: {
        "process.env.NODE_ENV": '"development"',
        "import.meta.env.VITE_API_URL": '""'
      },
      // Las imágenes y el video no hacen falta en las pruebas
      loader: { ".js": "jsx", ".png": "empty", ".webp": "empty", ".mp4": "empty", ".svg": "empty", ".css": "empty" },
      plugins: [pluginCobertura]
    },

    reporters: ["spec-simple", "coverage"],
    plugins: [
      "karma-jasmine",
      "karma-chrome-launcher",
      "karma-esbuild",
      "karma-coverage",
      { "reporter:spec-simple": ["type", ReporterSimple] }
    ],
    coverageReporter: {
      dir: path.join(__dirname, "coverage", "karma"),
      reporters: [{ type: "html", subdir: "html" }, { type: "text-summary" }, { type: "json-summary", subdir: "." }]
    },

    browsers: ["NavegadorSinVentana"],
    customLaunchers: {
      NavegadorSinVentana: { base: "ChromeHeadless", flags: ["--no-sandbox", "--disable-gpu"] }
    },
    client: { jasmine: { random: false }, clearContext: false },
    singleRun: true,
    browserNoActivityTimeout: 60000
  });
};

// Reporter sencillo: muestra cada suite y prueba con ✓ o ✗ (como el reporte de Jasmine)
function ReporterSimple(baseReporterDecorator) {
  baseReporterDecorator(this);
  let suiteActual = "";
  this.onSpecComplete = (browser, resultado) => {
    const suite = resultado.suite.join(" › ");
    if (suite !== suiteActual) {
      suiteActual = suite;
      this.write(`\n  ${suite}\n`);
    }
    const marca = resultado.skipped ? "-" : resultado.success ? "✓" : "✗";
    this.write(`    ${marca} ${resultado.description}\n`);
    if (!resultado.success && !resultado.skipped) {
      resultado.log.forEach((linea) => this.write(`      ${linea.split("\n")[0]}\n`));
    }
  };
  this.onRunComplete = (browsers, totales) => {
    this.write(`\n  Pruebas: ${totales.success} aprobadas, ${totales.failed} fallidas\n\n`);
  };
}
ReporterSimple.$inject = ["baseReporterDecorator"];
