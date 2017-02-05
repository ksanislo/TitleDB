'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = maReferencedListColumn;
function isSortFieldForMe(sortField, field) {
    if (!sortField) return false;
    return sortField.split('.')[0] == field.targetEntity().name() + '_ListView';
}

function maReferencedListColumn(NgAdminConfiguration, $stateParams) {
    return {
        scope: {
            'field': '&',
            'datastore': '&'
        },
        restrict: 'E',
        link: {
            pre: function pre(scope) {
                scope.field = scope.field();
                var targetEntity = scope.field.targetEntity();
                scope.entries = scope.datastore().getEntries(targetEntity.uniqueId + '_list');
                scope.entity = NgAdminConfiguration().getEntity(targetEntity.name());
                scope.sortField = isSortFieldForMe($stateParams.sortField, scope.field) ? $stateParams.sortField : scope.field.getSortFieldName();
                scope.sortDir = $stateParams.sortDir || scope.field.sortDir();
            }
        },
        template: '\n<ma-datagrid ng-if="::entries.length > 0" name="{{ field.datagridName() }}"\n    entries="::entries"\n    fields="::field.targetFields()"\n    list-actions="::field.listActions()"\n    entity="::entity"\n    sort-field="::sortField"\n    sort-dir="::sortDir"\n    datastore="::datastore()"\n    entry-css-classes="::field.entryCssClasses()">\n</ma-datagrid>'
    };
}

maReferencedListColumn.$inject = ['NgAdminConfiguration', '$stateParams'];
module.exports = exports['default'];
//# sourceMappingURL=maReferencedListColumn.js.map