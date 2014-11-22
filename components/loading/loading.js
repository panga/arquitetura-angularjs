'use strict';

angular.module('app')
    .run(function ($templateCache) {
        $templateCache.put('loading.html',
            '<div class=\'cg-busy-default-wrapper\'>\n' +
            '\n' +
            '      <div class=\'cg-busy-default-spinner\'>\n' +
            '         <div class=\'bar1\'></div>\n' +
            '         <div class=\'bar2\'></div>\n' +
            '         <div class=\'bar3\'></div>\n' +
            '         <div class=\'bar4\'></div>\n' +
            '         <div class=\'bar5\'></div>\n' +
            '         <div class=\'bar6\'></div>\n' +
            '         <div class=\'bar7\'></div>\n' +
            '         <div class=\'bar8\'></div>\n' +
            '         <div class=\'bar9\'></div>\n' +
            '         <div class=\'bar10\'></div>\n' +
            '         <div class=\'bar11\'></div>\n' +
            '         <div class=\'bar12\'></div>\n' +
            '      </div>\n' +
            '\n' +
            '</div>'
        );
    });
