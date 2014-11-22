'use strict';

angular.module('app')
    .factory('PersonResource', function(railsResourceFactory, railsSerializer, Config) {
        var Person = railsResourceFactory({
            url: Config.API.url + 'person',
            name: 'person',
            serializer: railsSerializer(function() {
                this.resource('friends', 'PersonResource');
                this.resource('timeline', 'PostResource');
            })
        });

        Person.prototype.addFriend = function() {
            return Person.$post(this.$url() + '/addFriend');
        };

        return Person;
    });