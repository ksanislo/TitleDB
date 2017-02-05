'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = maDateColumn;
function maDateColumn() {
    return {
        restrict: 'E',
        scope: {
            value: '&',
            field: '&'
        },
        link: function link(scope) {
            var field = scope.field();
            scope.format = field.format();
            if (!scope.format) {
                scope.format = field.type() === 'date' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss';
            }
        },
        template: '<span>{{ value() | date:format }}</span>'
    };
}

maDateColumn.$inject = [];
module.exports = exports['default'];
//# sourceMappingURL=maDateColumn.js.map