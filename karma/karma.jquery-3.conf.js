// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
module.exports = function(config) {
  config.set({
    basePath: '',
    plugins: [
      'karma-qunit',
      'karma-jquery',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-trx-reporter'
    ],
    frameworks: [
      'qunit',
      'jquery-3.0.0'
    ],
    files: [
      '../js/chordly.js',
      '../js/tests/*.js'
    ],
    reporters: [
      'trx',
      'progress'
    ],
    trxReporter: { outputFile: 'test-results/test-results-jq3.trx', shortTestName: false },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['ChromeHeadless', 'FirefoxHeadless'],
    customLaunchers: {
      FirefoxHeadless: {
        base: 'Firefox',
        flags: [ '-headless' ],
      },
    },
    singleRun: true,
    concurrency: Infinity
  })
}