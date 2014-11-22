'use strict';

angular.module('app')
    .config(function ($httpProvider, Config, $provide) {
        if (!Config.API.useMocks) {
            return;
        }

        $provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);

        var $log = {
            log: window.log
        };

        $httpProvider.interceptors.push(['$q', '$timeout', 'Config',
            function ($q, $timeout, Config) {
                return {
                    'request': function (config) {
                        $log.log('Requesting `' + config.url + '`', config);
                        return config;
                    },
                    'response': function (response) {
                        var deferred = $q.defer();

                        if (response.config.url.indexOf(Config.API.url) !== 0) {
                            return response; //Only handle calls to the API
                        }

                        //Fake delay on response from APIs and other urls
                        if (Config.API.fakeDelay && Config.API.fakeDelay > 0) {
                            $log.log('Delaying response with _' + Config.API.fakeDelay + 'ms_');

                            $timeout(function () {
                                deferred.resolve(response);
                            }, Config.API.fakeDelay);
                        } else {
                            deferred.resolve(response);
                        }

                        return deferred.promise;
                    },
                    'responseError': function (response) {
                        response.config = {}; //Fix loading bar issue
                        return response;
                    }

                };
            }
        ]);

    })
    .factory('mockRepository', function () {
        function Repository() {
            this.data = [];
            this.index = {};
        }

        Repository.prototype.insert = function (id, item) {
            item.id = id;

            if (this.index[id]) {
                this.delete(id);
            }

            this.data.push(item);
            this.index[id] = item;
            return item;
        };

        Repository.prototype.push = function (item) {
            var max = _.max(this.data, "id").id;
            item.id = max > 0 ? max + 1 : 1;
            this.insert(item.id, item);
            return item;
        };

        Repository.prototype.remove = function (id) {
            for (var prop in this.data) {
                if (this.data[prop].id === id) {
                    delete this.data[prop];
                }
            }
            delete this.index[id];
        };

        Repository.prototype.getAll = function () {
            return this.data;
        };

        Repository.prototype.getById = function (id) {
            return this.index[id];
        };

        return {
            create: function () {
                return new Repository();
            }
        };
    })
    .run(function (Config, $httpBackend) {
        if (!Config.API.useMocks) {
            return;
        }

        $httpBackend.whenGET(/\.html$/).passThrough();
        $httpBackend.whenGET(/\.json$/).passThrough();
    });
