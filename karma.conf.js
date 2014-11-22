'use strict';

module.exports = function (config) {
    var fs = require('fs'),
        preprocessors = {},
        mapAppPath = function (path) {
            return appPath + '/' + path;
        },
        bowerConfig = JSON.parse(fs.readFileSync('./.bowerrc', 'utf8')),
        appPath = bowerConfig.appPath || 'app',
        testPath = bowerConfig.testPath || 'test',
        libsPath = bowerConfig.directory || 'app/libs',
        js = require('./resources.json').javascript,
        jsFiles = js.external.concat(js.app).map(mapAppPath),
        files = jsFiles.concat([
            libsPath + '/jasmine-jquery/lib/jasmine-jquery.js',
            testPath + '/unit/mocks/**/*.js',
            appPath + '/scripts/**/*.js',
            testPath + '/unit/**/*.js',
            appPath + '/components/**/*.html',
            appPath + '/states/**/*.html'
        ]);

    function addPreprocessor(pros) {
        return function (path) {
            preprocessors[path] = pros;
        };
    }

    [
        '/components/**/*.js',
        '/scripts/**/*.js',
        '/states/**/*.js'
    ].map(mapAppPath)
        .forEach(addPreprocessor(['jshint', 'coverage']));

    [
        '/components/**/*.html',
        '/states/**/*.html'
    ].map(mapAppPath)
        .forEach(addPreprocessor('ng-html2js')); //insert row

    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: '',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['jasmine'],

        preprocessors: preprocessors,

        // list of files / patterns to load in the browser
        files: files,

        reporters: [ /*'spec', */ 'progress', 'coverage'],

        // optionally, configure the reporter
        coverageReporter: {
            type: 'html',
            dir: 'test/coverage/'
        },

        // list of files / patterns to exclude
        exclude: [
            libsPath + '/log/log.js',
            appPath + '/scripts/services/log.js'
        ],

        // web server port
        port: 9001,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['PhantomJS'],

        ngHtml2JsPreprocessor: {
            // setting this option will create only a single module that contains templates
            // from all the files, so you can load them all with module('foo')
            moduleName: 'compiledTemplates',
            stripPrefix: appPath + '/'
        },

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};
