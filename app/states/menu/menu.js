'use strict';

angular.module('app')
	.controller('MenuCtrl', function($scope, $timeout, UserResource) {
		$timeout(function() {
			UserResource.query().then(function(user) {
				user.person.get();
				$scope.user = user;
			});
		}, 1000);
	});