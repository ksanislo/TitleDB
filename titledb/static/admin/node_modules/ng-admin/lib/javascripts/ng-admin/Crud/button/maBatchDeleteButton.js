'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = maBatchDeleteButtonDirective;
function maBatchDeleteButtonDirective($state) {
    return {
        restrict: 'E',
        scope: {
            entity: '&',
            selection: '&',
            label: '@'
        },
        link: function link($scope) {
            $scope.label = $scope.label || 'DELETE';
            $scope.gotoBatchDelete = function () {
                var ids = $scope.selection().map(function (entry) {
                    return entry.identifierValue;
                });

                $state.go('batchDelete', angular.extend({
                    ids: ids,
                    entity: $scope.entity().name()
                }, $state.params));
            };
        },
        template: '<span ng-click="gotoBatchDelete()">\n<span class="glyphicon glyphicon-trash" aria-hidden="true"></span>&nbsp;<span class="hidden-xs" translate="{{ ::label }}"></span>\n</span>'
    };
}

maBatchDeleteButtonDirective.$inject = ['$state'];
module.exports = exports['default'];
//# sourceMappingURL=maBatchDeleteButton.js.map