'use strict';

angular.module('app')
    .provider('PeopleRepository', function() {
        this.$get = function(mockRepository) {
            return mockRepository.create();
        };
    })
    .run(function(Config, $httpBackend, $log, $http, PeopleRepository) {
        if (!Config.API.useMocks) {
            return;
        }

        var collectionUrl = Config.API.url + 'people';

        $log.log('***************************************************************************************************************');
        $log.log('Overriding all calls to `' + collectionUrl + '` with mocks defined in mocks/people.js*');
        $log.log('***************************************************************************************************************');

        $http.get('mocks/json/person.json').then(function(response) {
            var id = 0;
            angular.forEach(response.data, function(item, key) {
                PeopleRepository.insert(++id, {
                    commonFriends: item.friends.length,
                    person: item
                });
            });
        });

        //GET people
        $httpBackend.whenGET(collectionUrl).respond(function(method, url, data, headers) {
            $log.debug('Intercepted GET to `' + url + '`');

            return [200, PeopleRepository.getAll(), { /*headers*/ }];
        });

        //GET people?search
        var searchRegExp = /[\w\d\s-]+$/.toString().slice(1, -1);
        var personByName = new RegExp(collectionUrl + '\\?search=' + searchRegExp);
        $httpBackend.whenGET(personByName).respond(function(method, url, data, headers) {
            $log.debug('Intercepted GET to `' + url + '`');

            var search = url.match(new RegExp(searchRegExp))[0];

            var result = _.filter(PeopleRepository.getAll(), function(item) {
                return item.person.name.toLowerCase().indexOf(search.toLowerCase()) >= 0;
            });

            return [200, result, { /*headers*/ }];
        });

    });