'use strict';

angular.module('app')
    .config(function ($urlRouterProvider) {
        $urlRouterProvider.when('', '/');
        $urlRouterProvider.otherwise('/error?code=404');
    });
