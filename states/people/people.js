'use strict';

angular.module('app')
    .config(function($stateProvider) {
        $stateProvider.state('people', {
            url: '/people',
            templateUrl: 'states/people/people.html',
            controller: 'PeopleCtrl'
        });
    })
    .controller('PeopleCtrl', function($scope, UserResource, PeopleResource) {
        $scope.promise = UserResource.query().then(function(user) {
            $scope.user = user;
            user.person.get();

            PeopleResource.query().then(function(people) {
                $scope.people = _.filter(people, function(person) {
                    return person.id !== user.person.id;
                });
            });
        });

        $scope.canAdd = function(person) {
            var friend = _.find($scope.user.person.friends, {id : person.id});
            return !friend;
        };

        $scope.addFriend = function(person) {
            person.addFriend().then(function(userPerson) {
                $scope.user.person = userPerson;
            });
        };
    });