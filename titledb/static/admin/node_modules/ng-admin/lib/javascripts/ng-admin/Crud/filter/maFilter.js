'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = maFilter;
function maFilter(FieldViewConfiguration, $compile) {
    return {
        restrict: 'E',
        scope: {
            field: '=',
            datastore: '&',
            values: '=',
            value: '='
        },
        link: function link(scope, element) {
            scope.datastore = scope.datastore();
            element.append(scope.field.getTemplateValue(scope.values) || FieldViewConfiguration[scope.field.type()].getFilterWidget());
            $compile(element.contents())(scope);
        }
    };
}

maFilter.$inject = ['FieldViewConfiguration', '$compile'];
module.exports = exports['default'];
//# sourceMappingURL=maFilter.js.map