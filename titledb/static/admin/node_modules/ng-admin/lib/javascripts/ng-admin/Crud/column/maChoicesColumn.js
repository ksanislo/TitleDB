'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = maChoicesColumn;
function maChoicesColumn() {
    return {
        restrict: 'E',
        scope: {
            values: '&'
        },
        template: '<span ng-repeat="ref in values() track by $index" class="label label-default">{{ ref }}</span>'
    };
}

maChoicesColumn.$inject = [];
module.exports = exports['default'];
//# sourceMappingURL=maChoicesColumn.js.map