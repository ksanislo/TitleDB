'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = maListButtonDirective;
/**
 * Link to list
 *
 * Usage:
 * <ma-list-button entity="entity" size="xs"></ma-list-button>
 */
function maListButtonDirective($state) {
    return {
        restrict: 'E',
        scope: {
            entity: '&',
            entityName: '@',
            size: '@',
            label: '@'
        },
        link: function link(scope, element, attrs) {
            scope.label = scope.label || 'LIST';
            var entityName = scope.entity() ? scope.entity().name() : attrs.entityName;
            var stateParams = entityName == $state.params.entity ? _extends({}, $state.params) : {};
            stateParams.entity = entityName;
            scope.stateParams = stateParams;
        },
        template: ' <a class="btn btn-default" ng-class="size ? \'btn-\' + size : \'\'" ui-sref="list(stateParams)">\n<span class="glyphicon glyphicon-list" aria-hidden="true"></span>&nbsp;<span class="hidden-xs" translate="{{ ::label }}"></span>\n</a>'
    };
}

maListButtonDirective.$inject = ['$state'];
module.exports = exports['default'];
//# sourceMappingURL=maListButton.js.map