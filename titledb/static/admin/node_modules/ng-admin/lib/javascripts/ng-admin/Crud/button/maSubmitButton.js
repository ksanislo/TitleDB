'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = maSubmitButtonDirective;
/**
 * Save button
 *
 * Usage:
 * <ma-submit-button label="Save changes"></ma-submit-button>
 */
function maSubmitButtonDirective() {
    return {
        restrict: 'E',
        scope: {
            label: '@'
        },
        link: function link(scope) {
            scope.label = scope.label || 'SAVE';
        },
        template: '<button type="submit" class="btn btn-primary"><span class="glyphicon glyphicon-ok"></span>&nbsp;<span class="hidden-xs" translate="{{ ::label }}"></span></button>'
    };
}

maSubmitButtonDirective.$inject = [];
module.exports = exports['default'];
//# sourceMappingURL=maSubmitButton.js.map