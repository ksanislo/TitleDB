'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = maReferenceManyLinkColumn;
function maReferenceManyLinkColumn(NgAdminConfiguration) {
    return {
        restrict: 'E',
        scope: {
            field: '&',
            values: '&',
            ids: '&'
        },
        link: function link(scope) {
            scope.field = scope.field();
            scope.values = scope.values();
            scope.ids = scope.ids();
            scope.referenceEntity = scope.field.targetEntity().name();
            scope.route = NgAdminConfiguration().getEntity(scope.referenceEntity).isReadOnly ? 'show' : 'edit';
        },
        template: '<a ng-repeat="ref in values track by $index" ui-sref="{{route}}({ entity: referenceEntity, id: ids[$index] })" class="multiple">\n    <span class="label label-default">{{ ref }}</span>\n</a>'
    };
}

maReferenceManyLinkColumn.$inject = ['NgAdminConfiguration'];
module.exports = exports['default'];
//# sourceMappingURL=maReferenceManyLinkColumn.js.map