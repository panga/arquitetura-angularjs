'use strict';

module.exports.config = {
    baseUrl: 'http://localhost:9000',
    seleniumAddress: 'http://localhost:4444/wd/hub',

    specs: [
        'test/e2e/**/*.js'
    ],

    multiCapabilities: [{
        browserName: 'chrome'
    }, {
        browserName: 'firefox'
    }]

};
