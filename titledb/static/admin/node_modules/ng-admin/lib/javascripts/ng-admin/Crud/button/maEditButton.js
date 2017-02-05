'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = maEditButtonDirective;
/**
 * Link to edit
 *
 * Usage:
 * <ma-edit-button entity="entity" entry="entry" size="xs"></ma-edit-button>
 */
function maEditButtonDirective($state) {
    return {
        restrict: 'E',
        scope: {
            entity: '&',
            entityName: '@',
            entry: '&',
            size: '@',
            label: '@'
        },
        link: function link(scope, element, attrs) {
            scope.label = scope.label || 'EDIT';
            var entityName = scope.entity() ? scope.entity().name() : attrs.entityName;
            var stateParams = entityName == $state.params.entity ? _extends({}, $state.params) : {};
            stateParams.entity = entityName;
            stateParams.id = scope.entry().identifierValue;
            scope.stateParams = stateParams;
        },
        template: ' <a class="btn btn-default" ng-class="size ? \'btn-\' + size : \'\'" ui-sref="edit(stateParams)">\n<span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>&nbsp;<span class="hidden-xs" translate="{{ ::label }}"></span>\n</a>'
    };
}

maEditButtonDirective.$inject = ['$state'];
module.exports = exports['default'];
//# sourceMappingURL=maEditButton.js.map