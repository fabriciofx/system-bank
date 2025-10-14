module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher')
    ],
    client: {
      clearContext: false,
      captureConsole: true,
      jasmine: {
        random: false
      }
    },
    reporters: ['progress'],
    browsers: ['ChromeHeadless'],
    browserConsoleLogOptions: {
      level: 'log',
      format: '%b %T: %m',
      terminal: true
    },
    logLevel: config.LOG_LOG,
    singleRun: true,
    restartOnFileChange: false
  });
};
