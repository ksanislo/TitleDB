'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = maListActions;
function maListActions() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            'buttons': '&',
            'entry': '&',
            'entity': '&'
        },
        link: function link($scope) {
            $scope.buttons = $scope.buttons();
            $scope.entry = $scope.entry();
            $scope.entity = $scope.entity();
            $scope.customTemplate = false;
            if (typeof $scope.buttons === 'string') {
                $scope.customTemplate = $scope.buttons;
                $scope.buttons = null;
            }
        },
        template: '<span compile="customTemplate">\n    <span ng-repeat="button in ::buttons" ng-switch="button">\n        <ma-show-button ng-switch-when="show" entry="::entry" entity="::entity" size="xs"></ma-show-button>\n        <ma-edit-button ng-switch-when="edit" ng-if="::entity.editionView().enabled" entry="::entry" entity="::entity" size="xs"></ma-edit-button>\n        <ma-delete-button ng-switch-when="delete" ng-if="::entity.deletionView().enabled" entry="::entry" entity="::entity" size="xs"></ma-delete-button>\n        <span ng-switch-default><span compile="button"></span></span>\n    </span>\n</span>'
    };
}

maListActions.$inject = [];
module.exports = exports['default'];
//# sourceMappingURL=maListActions.js.map