'use strict';

angular.module('app')
    .provider('UserRepository', function() {
        this.$get = function(mockRepository) {
            return mockRepository.create();
        };
    })
    .run(function(Config, $httpBackend, $log, $http, UserRepository, PostRepository, PersonRepository) {
        if (!Config.API.useMocks) {
            return;
        }

        var collectionUrl = Config.API.url + 'user';

        $log.log('***************************************************************************************************************');
        $log.log('Overriding all calls to `' + collectionUrl + '` with mocks defined in mocks/user.js*');
        $log.log('***************************************************************************************************************');

        $http.get('mocks/json/user.json').then(function(response) {
            var user = response.data;
            UserRepository.insert(1, user);
        });

        //GET user
        $httpBackend.whenGET(collectionUrl).respond(function(method, url, data, headers) {
            $log.debug('Intercepted GET to `' + url + '`');

            var user = UserRepository.getById(1);
            if (user) {
                delete user.id;
            }

            return [200, user, { /*headers*/ }];
        });

        //POST user/post
        $httpBackend.whenPOST(collectionUrl + '/post').respond(function(method, url, data, headers) {
            data = JSON.parse(data);

            $log.debug('Intercepted POST to `' + url + '`', data);

            var user = UserRepository.getById(1);

            var post = PostRepository.push({
                text: data.text,
                date: moment.utc().format(),
                likes: 0,
                person: user.person
            });

            var person = PersonRepository.getById(user.person.id);
            person.timeline.push({
                id: post.id
            });

            return [200, post, { /*headers*/ }];
        });

    });