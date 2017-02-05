'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = maTemplateColumn;
function maTemplateColumn() {
    return {
        restrict: 'E',
        scope: {
            field: '&',
            entry: '&',
            entity: '&'
        },
        link: function link(scope) {
            scope.field = scope.field();
            scope.entry = scope.entry();
            scope.entity = scope.entity();
        },
        template: '<span compile="field.getTemplateValue(entry)"></span>'
    };
}

maTemplateColumn.$inject = [];
module.exports = exports['default'];
//# sourceMappingURL=maTemplateColumn.js.map