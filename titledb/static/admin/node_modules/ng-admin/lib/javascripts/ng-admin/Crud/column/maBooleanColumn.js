'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = maBooleanColumn;
function maBooleanColumn() {
    return {
        restrict: 'E',
        scope: {
            value: '&'
        },
        link: function link(scope) {
            scope.value = scope.value();
        },
        template: '<span class="glyphicon" ng-class="{\'glyphicon-ok\': !!value, \'glyphicon-remove\': !value }"></span>'
    };
}

maBooleanColumn.$inject = [];
module.exports = exports['default'];
//# sourceMappingURL=maBooleanColumn.js.map