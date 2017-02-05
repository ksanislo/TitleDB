'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = maDatagridInfinitePagination;

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function maDatagridInfinitePagination($window, $document) {

    var windowElement = _angular2.default.element($window);
    var offset = 100,
        body = $document[0].body;

    return {
        restrict: 'E',
        scope: {
            perPage: '@',
            totalItems: '@',
            nextPage: '&'
        },
        link: function link(scope) {
            var perPage = parseInt(scope.perPage, 10) || 1,
                totalItems = parseInt(scope.totalItems, 10),
                nbPages = Math.ceil(totalItems / perPage) || 1,
                page = 1,
                loadedPages = [];
            function handler() {
                if (body.offsetHeight - $window.innerHeight - $window.scrollY < offset) {
                    if (page >= nbPages) {
                        return;
                    }
                    page++;
                    if (page in loadedPages) {
                        return;
                    }
                    loadedPages.push(page);
                    scope.nextPage()(page);
                }
            }
            windowElement.bind('scroll', handler);
            scope.$on('$destroy', function destroy() {
                windowElement.unbind('scroll', handler);
            });
        }
    };
}

maDatagridInfinitePagination.$inject = ['$window', '$document'];
module.exports = exports['default'];
//# sourceMappingURL=maDatagridInfinitePagination.js.map