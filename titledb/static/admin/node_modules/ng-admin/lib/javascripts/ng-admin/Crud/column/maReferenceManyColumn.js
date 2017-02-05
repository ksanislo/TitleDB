'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = maReferenceManyColumn;
function maReferenceManyColumn() {
    return {
        restrict: 'E',
        scope: {
            values: '&'
        },
        template: '<span ng-repeat="ref in values() track by $index">\n    <span class="label label-default">{{ ref }}</span>\n</span>'
    };
}

maReferenceManyColumn.$inject = [];
module.exports = exports['default'];
//# sourceMappingURL=maReferenceManyColumn.js.map