'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = maFilterButton;
function maFilterButton() {
    return {
        restrict: 'E',
        scope: {
            filters: '&',
            enabledFilters: '=',
            enableFilter: '&',
            label: "@"
        },
        link: function link(scope) {
            scope.label = scope.label || 'ADD_FILTER';
            scope.notYetEnabledFilters = function () {
                return scope.filters().filter(function (filter) {
                    return scope.enabledFilters.indexOf(filter) === -1;
                });
            };
            scope.hasFilters = function () {
                return scope.notYetEnabledFilters().length > 0;
            };
        },
        template: '<span class="btn-group" uib-dropdown is-open="isopen" ng-if="hasFilters()">\n    <button type="button" class="btn btn-default dropdown-toggle" uib-dropdown-toggle >\n        <span class="glyphicon glyphicon-filter" aria-hidden="true"></span>&nbsp;<span class="hidden-xs" translate="{{ ::label }}"></span>&nbsp;<span class="caret"></span>\n    </button>\n    <ul class="dropdown-menu" role="menu">\n        <li ng-repeat="filter in notYetEnabledFilters()" ng-switch="button">\n            <a ng-click="enableFilter()(filter)">{{ filter.label() | translate }}</a>\n        </li>\n    </ul>\n</span>'
    };
}

maFilterButton.$inject = [];
module.exports = exports['default'];
//# sourceMappingURL=maFilterButton.js.map