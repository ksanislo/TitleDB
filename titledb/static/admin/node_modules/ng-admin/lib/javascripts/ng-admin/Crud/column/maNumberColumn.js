'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = maNumberColumn;
function maNumberColumn() {
    return {
        restrict: 'E',
        scope: {
            value: '&',
            field: '&'
        },
        template: '<span>{{ value() | numeraljs:field().format() }}</span>'
    };
}

maNumberColumn.$inject = [];
module.exports = exports['default'];
//# sourceMappingURL=maNumberColumn.js.map