'use strict';

angular.module('app')
    .factory('PostResource', function(railsResourceFactory, railsSerializer, Config) {
        var Post = railsResourceFactory({
            url: Config.API.url + 'post',
            name: 'post',
            serializer: railsSerializer(function() {
                this.resource('person', 'PersonResource');
            })
        });

        Post.prototype.like = function() {
            return Post.$post(this.$url() + '/like');
        };

        return Post;
    });