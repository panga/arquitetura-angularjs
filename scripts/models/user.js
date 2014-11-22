'use strict';

angular.module('app')
    .factory('UserResource', function(railsResourceFactory, railsSerializer, Config) {
        var User = railsResourceFactory({
            url: Config.API.url + 'user',
            name: 'user',
            serializer: railsSerializer(function() {
                this.resource('person', 'PersonResource');
            })
        });

        User.prototype.post = function(text) {
            return User.$post(this.$url() + '/post', {
                text: text
            });
        };

        return User;
    });