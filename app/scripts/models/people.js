'use strict';

angular.module('app')
    .factory('PeopleResource', function(railsResourceFactory, railsSerializer, Config) {
        var People = railsResourceFactory({
            url: Config.API.url + 'people',
            name: 'people',
            serializer: railsSerializer(function() {
                this.resource('person', 'PersonResource');
            })
        });

        return People;
    });