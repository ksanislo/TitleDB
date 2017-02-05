'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = maJsonColumn;
function maJsonColumn($compile) {
    return {
        restrict: 'E',
        scope: {
            value: '&'
        },
        link: function link(scope, element) {
            scope.guessType = function (obj) {
                var type = Object.prototype.toString.call(obj);

                if (type === "[object Object]") {
                    return "Object";
                }

                if (type === "[object Array]") {
                    return "Array";
                }

                return "Literal";
            };

            var template = '<span ng-switch="guessType(value())">\n    <table class="table table-condensed" ng-switch-when="Array">\n        <tbody>\n            <tr ng-repeat="val in value() track by $index">\n                <td ng-switch="guessType(val)">\n                    <ma-json-column ng-switch-when="Object" value="::val"></ma-json-column>\n                    <ma-json-column ng-switch-when="Array" value="::val"></ma-json-column>\n                    <span ng-switch-when="Literal">{{ val }}</span>\n                </td>\n            </tr>\n        </tbody>\n    </table>\n    <table class="table table-condensed table-bordered" ng-switch-when="Object">\n        <tbody>\n            <tr ng-repeat="(key, val) in value() track by key">\n                <th class="active">{{ key }}</th>\n                <td ng-switch="guessType(val)">\n                    <ma-json-column ng-switch-when="Object" value="::val"></ma-json-column>\n                    <ma-json-column ng-switch-when="Array" value="::val"></ma-json-column>\n                    <span ng-switch-when="Literal">{{ val }}</span>\n                </td>\n            </tr>\n        </tbody>\n    </table>\n</span>';

            var newElement = angular.element(template);
            $compile(newElement)(scope);
            element.replaceWith(newElement);
        }
    };
}

maJsonColumn.$inject = ['$compile'];
module.exports = exports['default'];
//# sourceMappingURL=maJsonColumn.js.map