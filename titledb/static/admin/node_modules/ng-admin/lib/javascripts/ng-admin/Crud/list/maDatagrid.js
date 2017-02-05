'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = maDatagrid;

var _maDatagridController = require('./maDatagridController');

var _maDatagridController2 = _interopRequireDefault(_maDatagridController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function maDatagrid() {
    return {
        restrict: 'E',
        scope: {
            name: '@',
            entries: '=',
            selection: '=',
            fields: '&',
            listActions: '&',
            entity: '&',
            entryCssClasses: '&?',
            datastore: '&',
            sortField: '&',
            sortDir: '&',
            sort: '&'
        },
        controllerAs: 'datagrid',
        controller: _maDatagridController2.default,
        template: '<table class="grid table table-condensed table-hover table-striped">\n    <thead>\n        <tr>\n            <th ng-if="selection">\n                <ma-datagrid-multi-selector toggle-select-all="toggleSelectAll()" selection="selection" entries="entries"/>\n            </th>\n            <th ng-repeat="field in fields() track by $index" ng-class="field.getCssClasses()" class="ng-admin-column-{{ ::field.name() }} ng-admin-type-{{ ::field.type() }}">\n                <a ng-if="field.sortable()" ng-click="datagrid.sortCallback(field)">\n                    <span class="glyphicon {{ sortDir() === \'DESC\' ? \'glyphicon-chevron-up\': \'glyphicon-chevron-down\' }}" ng-if="datagrid.isSorting(field)"></span>\n                    {{ field.label() | translate }}\n                </a>\n                <span ng-if="!field.sortable()">\n                    {{ field.label() | translate }}\n                </span>\n            </th>\n            <th ng-if="datagrid.shouldDisplayActions" class="ng-admin-column-actions" translate="ACTIONS"></th>\n        </tr>\n    </thead>\n\n    <tbody>\n        <tr ng-repeat="entry in entries track by entry.identifierValue" ng-class="getEntryCssClasses(entry)">\n            <td ng-if="selection">\n                <ma-datagrid-item-selector toggle-select="toggleSelect(entry)" selection="selection" entry="entry"/>\n            </td>\n            <td ng-repeat="field in fields() track by $index" ng-class="field.getCssClasses(entry)" class="ng-admin-column-{{ ::field.name() }} ng-admin-type-{{ ::field.type() }}">\n                <ma-column field="::field" entry="::entry" entity="::entity" datastore="datagrid.datastore"></ma-column>\n            </td>\n            <td ng-if="datagrid.shouldDisplayActions" class="ng-admin-column-actions">\n                <ma-list-actions entry="::entry" entity="::entity" buttons="listActions()"></ma-list-actions>\n            </td>\n        </tr>\n    </tbody>\n</table>'
    };
}

maDatagrid.$inject = [];
module.exports = exports['default'];
//# sourceMappingURL=maDatagrid.js.map