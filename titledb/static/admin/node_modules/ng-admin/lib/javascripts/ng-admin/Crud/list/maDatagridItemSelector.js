'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = maDatagridItemSelector;
function maDatagridItemSelector() {
    return {
        restrict: 'E',
        scope: {
            entry: '=',
            selection: '=',
            toggleSelect: '&'
        },
        template: '<input type="checkbox" ng-click="toggle(entry)" ng-checked="isInSelection()"/>',
        link: function link(scope) {
            scope.toggle = function (entry) {
                return scope.toggleSelect({ entry: entry });
            };
            var e = scope.entry;
            scope.isInSelection = function () {
                return scope.selection.filter(function (s) {
                    return s._entityName == e._entityName && s._identifierValue == e._identifierValue;
                }).length > 0;
            };
        }
    };
}

maDatagridItemSelector.$inject = [];
module.exports = exports['default'];
//# sourceMappingURL=maDatagridItemSelector.js.map