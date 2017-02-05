'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = maTextField;
/**
 * Edition field for a multiline string - a textarea.
 *
 * @example <ma-text-field field="field" value="value"></ma-text-field>
 */
function maTextField() {
    return {
        scope: {
            'field': '&',
            'value': '='
        },
        restrict: 'E',
        link: function link(scope, element) {
            var field = scope.field();
            scope.name = field.name();
            scope.v = field.validation();
            var input = element.children()[0];
            var attributes = field.attributes();
            for (var name in attributes) {
                input.setAttribute(name, attributes[name]);
            }
        },
        template: '<textarea ng-model="value" id="{{ name }}" name="{{ name }}" class="form-control"\n    ng-required="v.required" ng-minlength="v.minlength" ng-maxlength="v.maxlength" ng-pattern="v.pattern">\n</textarea>'
    };
}

maTextField.$inject = [];
module.exports = exports['default'];
//# sourceMappingURL=maTextField.js.map