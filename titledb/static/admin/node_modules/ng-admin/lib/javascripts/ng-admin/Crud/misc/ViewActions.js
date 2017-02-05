'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = ViewActions;
function ViewActions($injector) {
    var $compile = $injector.get('$compile');

    return {
        restrict: 'E',
        transclude: true,
        scope: {
            override: '&',
            entry: '=',
            entity: '=',
            selection: '=',
            batchButtons: '&',
            datastore: '=',
            search: '=',
            filters: '&',
            enabledFilters: '=',
            enableFilter: '&'
        },
        link: function link($scope, element, attrs, controller, transcludeFn) {
            var override = $scope.override();
            if (!override) {
                // use the default tag content
                transcludeFn($scope, function (clone) {
                    element.append(clone);
                });
                return;
            }
            if (typeof override === 'string') {
                // custom template, use it instead of default template
                element.html(override);
                $compile(element.contents())($scope);
                return;
            }
            // list of buttons - default template
            $scope.buttons = override;
        },
        template: '<span ng-repeat="button in buttons" ng-switch="button" class="view_actions">\n    <ma-filter-button ng-switch-when="filter" filters="filters()" enabled-filters="enabledFilters" enable-filter="enableFilter()"></ma-filter-button>\n    <ma-view-batch-actions ng-switch-when="batch" buttons="batchButtons()" selection="selection" entity="entity"></ma-view-batch-actions>\n    <ma-back-button ng-switch-when="back"></ma-back-button>\n    <ma-list-button ng-switch-when="list" entity="entity"></ma-list-button>\n    <ma-create-button ng-switch-when="create" entity="entity"></ma-create-button>\n    <ma-show-button ng-switch-when="show" entry="entry" entity="entity"></ma-show-button>\n    <ma-edit-button ng-switch-when="edit" entry="entry" entity="entity"></ma-edit-button>\n    <ma-delete-button ng-switch-when="delete" entry="entry" entity="entity"></ma-delete-button>\n    <ma-export-to-csv-button ng-switch-when="export" datastore="datastore" entity="entity"></ma-export-to-csv-button>\n    <span ng-switch-default><span compile="button"></span></span>\n</span>'
    };
}

ViewActions.$inject = ['$injector'];
module.exports = exports['default'];
//# sourceMappingURL=ViewActions.js.map