'use strict';

angular.module('app')
    .constant('Config', _.merge({
        environment: 'production', //development or production
        API: {
            url: window.location.protocol + '//' + window.location.hostname + ':' + (window.location.port || 80) +
                '/api/',
            useMocks: false,
            fakeDelay: 0
        }
    }, angular._localConfig || {}))
    .constant('cgBusyDefaults', {
        templateUrl: 'loading.html',
        backdrop: true
    })
    .config(function (cfpLoadingBarProvider, RailsResourceProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
        RailsResourceProvider.rootWrapping(false);
    });
