'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = maReferenceColumn;
function maReferenceColumn() {
    return {
        restrict: 'E',
        scope: {
            field: '&',
            value: '&',
            datastore: '&'
        },
        link: {
            pre: function pre(scope) {
                var value = scope.value();
                scope.field = scope.field();
                scope.targetEntity = scope.field.targetEntity();
                scope.targetField = scope.field.targetField();
                var identifierName = scope.targetEntity.identifier().name();
                scope.referencedEntry = scope.datastore().getFirstEntry(scope.targetEntity.uniqueId + '_values', function (entry) {
                    return entry.values[identifierName] == value;
                });
            }
        },
        template: '<ma-column field="::targetField" entry="::referencedEntry" entity="::targetEntity" datastore="::datastore()"></ma-column>'
    };
}

maReferenceColumn.$inject = [];
module.exports = exports['default'];
//# sourceMappingURL=maReferenceColumn.js.map