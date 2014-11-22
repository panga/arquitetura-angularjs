'use strict';

angular.module('app')
    .config(function($stateProvider) {
        $stateProvider.state('friends', {
            url: '/friends',
            templateUrl: 'states/friends/friends.html',
            controller: 'FriendsCtrl'
        });
    })
    .controller('FriendsCtrl', function($scope, UserResource) {
        $scope.promise = UserResource.query().then(function(user) {
            $scope.user = user;

            user.person.get().then(function(person) {
                $scope.friends = person.friends;

                angular.forEach(person.friends, function(item) {
                    item.get();
                });
            });
        });
    });