'use strict';

angular.module('app')
    .config(function($stateProvider) {
        $stateProvider.state('home', {
            url: '/',
            templateUrl: 'states/home/home.html',
            controller: 'HomeCtrl'
        });
    })
    .controller('HomeCtrl', function($scope, UserResource) {
        $scope.promise = UserResource.query().then(function(user) {
            $scope.user = user;

            refreshTimeline();
        });

        function refreshTimeline() {
            $scope.user.person.get().then(function(person) {
                $scope.timeline = person.timeline;
            });
        }

        $scope.like = function(post) {
            post.like().then(function(data) {
                post.likes = data.likes;
            });
        };

        $scope.post = function() {
            if ($scope.text && $scope.text.length > 0) {
                $scope.user.post($scope.text);
                $scope.text = '';
                refreshTimeline();
            }
        };
    });