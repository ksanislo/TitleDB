'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = maCreateButtonDirective;
/**
 * Link to create
 *
 * Usage:
 * <ma-create-button entity="entity" default-values="{}" size="xs"></ma-create-button>
 */
function maCreateButtonDirective($state) {
    return {
        restrict: 'E',
        scope: {
            entity: '&',
            entityName: '@',
            defaultValues: '&',
            size: '@',
            label: '@'
        },
        link: function link(scope, element, attrs) {
            scope.label = scope.label || 'CREATE';
            var entityName = scope.entity() ? scope.entity().name() : attrs.entityName;
            var stateParams = entityName == $state.params.entity ? _extends({}, $state.params) : {};
            stateParams.entity = entityName;
            stateParams.defaultValues = scope.defaultValues();
            scope.stateParams = stateParams;
        },
        template: ' <a class="btn btn-default" ng-class="size ? \'btn-\' + size : \'\'" ui-sref="create(stateParams)">\n<span class="glyphicon glyphicon-plus" aria-hidden="true"></span>&nbsp;<span class="hidden-xs" translate="{{ ::label }}"></span>\n</a>'
    };
}

maCreateButtonDirective.$inject = ['$state'];
module.exports = exports['default'];
//# sourceMappingURL=maCreateButton.js.map