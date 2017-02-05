'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = maJsonValidator;
function maJsonValidator() {
    return {
        require: 'ngModel',
        link: function link(scope, elm, attr, ctrl) {
            ctrl.$validators.json = function (value) {
                if (ctrl.$isEmpty(value)) {
                    return true;
                }

                try {
                    angular.fromJson(value);

                    return true;
                } catch (e) {
                    return false;
                }
            };
        }
    };
}

maJsonValidator.$inject = [];
module.exports = exports['default'];
//# sourceMappingURL=maJsonValidator.js.map