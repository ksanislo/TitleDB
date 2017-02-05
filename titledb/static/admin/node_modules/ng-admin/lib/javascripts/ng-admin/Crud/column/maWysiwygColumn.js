'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = maWysiwygColumn;
function maWysiwygColumn($filter) {
    return {
        restrict: 'E',
        scope: {
            value: '&',
            field: '&'
        },
        link: function link(scope) {
            var value = scope.value();
            if (scope.field().stripTags()) {
                value = $filter('stripTags')(value);
            }
            scope.htmlValue = value;
        },
        template: '<span ng-bind-html="htmlValue"></span>'
    };
}

maWysiwygColumn.$inject = ['$filter'];
module.exports = exports['default'];
//# sourceMappingURL=maWysiwygColumn.js.map