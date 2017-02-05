'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = OrderElement;
function OrderElement() {
    return function (input) {
        var results = [],
            objectKey;

        for (objectKey in input) {
            results.push(input[objectKey]);
        }

        results.sort(function (field1, field2) {
            return typeof field1.order === 'function' ? field1.order() - field2.order() : field1.order - field2.order;
        });

        return results;
    };
}

OrderElement.$inject = [];
module.exports = exports['default'];
//# sourceMappingURL=OrderElement.js.map