'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = maTemplateField;
function maTemplateField() {
    return {
        restrict: 'E',
        scope: {
            field: '&',
            entry: '&',
            entity: '&',
            value: '=',
            values: '='
        },
        link: function link(scope) {
            scope.field = scope.field();
            scope.entry = scope.entry();
            scope.entity = scope.entity();
        },
        template: '<span compile="field.getTemplateValue(entry)"></span>'
    };
}

maTemplateField.$inject = [];
module.exports = exports['default'];
//# sourceMappingURL=maTemplateField.js.map