'use strict';

angular.module('app')
    .provider('PostRepository', function() {
        this.$get = function(mockRepository) {
            return mockRepository.create();
        };
    })
    .run(function(Config, $httpBackend, $log, $http, PostRepository) {
        if (!Config.API.useMocks) {
            return;
        }

        var collectionUrl = Config.API.url + 'post';
        var IdRegExp = /[\d\w-_]+$/.toString().slice(1, -1);
        var postById = new RegExp(collectionUrl + '/' + IdRegExp);

        $log.log('***************************************************************************************************************');
        $log.log('Overriding all calls to `' + collectionUrl + '` with mocks defined in mocks/post.js*');
        $log.log('***************************************************************************************************************');

        $http.get('mocks/json/post.json').then(function(response) {
            angular.forEach(response.data, function(item, key) {
                PostRepository.insert(item.id, item);
            });
        });

        //GET post/:id
        $httpBackend.whenGET(postById).respond(function(method, url, data, headers) {
            $log.debug('Intercepted GET to `' + url + '`');

            var id = url.match(new RegExp(IdRegExp))[0];
            return [200, PostRepository.getById(id), { /*headers*/ }];
        });

        //POST post/:id/like
        var IdRegExp2 = /[\d\w-_]+/.toString().slice(1, -1);
        $httpBackend.whenPOST(new RegExp(collectionUrl + '/' + IdRegExp2 + '/like')).respond(function(method, url, data, headers) {
            $log.debug('Intercepted POST to `' + url + '`');

            var postId = url.match(new RegExp('(' + IdRegExp2 + ')(/like)'))[1];
            var post = PostRepository.getById(postId);
            post.likes ++;

            return [200, post, { /*headers*/ }];
        });

    });