'use strict';

describe('Index route', function () {
    var ptor = protractor.getInstance();

    describe('index', function () {
        it('should display the correct title', function () {
            ptor.get('/#');
            expect(ptor.getTitle()).toContain('Social Network');
        });
    });
});
