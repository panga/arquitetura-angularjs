'use strict';

angular.module('app')
    .config(function ($stateProvider) {
        $stateProvider.state('error', {
            url: '/error?code',
            templateUrl: 'states/error/error.html',
            controller: 'ErrorCtrl'
        });
    })
    .controller('ErrorCtrl', function ($scope, $stateParams) {
        $scope.errorCode = $stateParams.code;
    });
