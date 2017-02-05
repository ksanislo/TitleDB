'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = maStringColumn;
function maStringColumn() {
    return {
        restrict: 'E',
        scope: {
            value: '&'
        },
        template: '<span>{{ value() | translate }}</span>'
    };
}

maStringColumn.$inject = [];
module.exports = exports['default'];
//# sourceMappingURL=maStringColumn.js.map