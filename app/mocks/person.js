'use strict';

angular.module('app')
    .provider('PersonRepository', function() {
        this.$get = function(mockRepository) {
            return mockRepository.create();
        };
    })
    .run(function(Config, $httpBackend, $log, $http, UserRepository, PersonRepository, PostRepository) {
        if (!Config.API.useMocks) {
            return;
        }

        var collectionUrl = Config.API.url + 'person';
        var IdRegExp = /[\d\w-_]+$/.toString().slice(1, -1);
        var personById = new RegExp(collectionUrl + '/' + IdRegExp);

        $log.log('***************************************************************************************************************');
        $log.log('Overriding all calls to `' + collectionUrl + '` with mocks defined in mocks/person.js*');
        $log.log('***************************************************************************************************************');

        $http.get('mocks/json/person.json').then(function(response) {
            angular.forEach(response.data, function(item, key) {
                PersonRepository.insert(item.id, item);
            });
        });

        //GET person/:id
        $httpBackend.whenGET(personById).respond(function(method, url, data, headers) {
            $log.debug('Intercepted GET to `' + url + '`');

            var id = url.match(new RegExp(IdRegExp))[0];

            var person = PersonRepository.getById(id);
            
            angular.forEach(person.timeline, function(item, index) {
                var post = PostRepository.getById(item.id);
                var postPerson = PersonRepository.getById(post.person.id);
                post.person.name = postPerson.name;
                person.timeline[index] = post;
            });

            return [200, person, { /*headers*/ }];
        });

        //POST person/:id/addFriend
        var IdRegExp2 = /[\d\w-_]+/.toString().slice(1, -1);
        $httpBackend.whenPOST(new RegExp(collectionUrl + '/' + IdRegExp2 + '/addFriend')).respond(function(method, url, data, headers) {
            $log.debug('Intercepted POST to `' + url + '`');

            var personId = parseInt(url.match(new RegExp('(' + IdRegExp2 + ')(/addFriend$)'))[1],10);
            var user = UserRepository.getById(1);
            var person = PersonRepository.getById(user.person.id);
            person.friends.push({
                id: personId
            });
            var friend = PersonRepository.getById(personId);
            angular.forEach(friend.timeline, function(item) {
                person.timeline.push(item);
            });

            return [200, person, { /*headers*/ }];
        });

    });
