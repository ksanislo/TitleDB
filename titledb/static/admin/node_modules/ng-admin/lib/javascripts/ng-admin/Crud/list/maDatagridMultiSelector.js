'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = maDatagridMultiSelector;
function maDatagridMultiSelector() {
    return {
        restrict: 'E',
        scope: {
            entries: '=',
            selection: '=',
            toggleSelectAll: '&'
        },
        template: '<input type="checkbox" ng-click="toggleSelectAll()" ng-checked="selection.length == entries.length" />',
        link: function link(scope, element) {
            scope.$watch('selection', function (selection) {
                element.children()[0].indeterminate = selection.length > 0 && selection.length != scope.entries.length;
            });
            scope.$watch('entries', function (entries) {
                element.children()[0].indeterminate = scope.selection.length > 0 && scope.selection.length != entries.length;
            });
        }
    };
}

maDatagridMultiSelector.$inject = [];
module.exports = exports['default'];
//# sourceMappingURL=maDatagridMultiSelector.js.map