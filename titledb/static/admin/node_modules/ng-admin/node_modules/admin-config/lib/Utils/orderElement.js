"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = {
    order: function order(input) {
        var results = [],
            objectKey;

        for (objectKey in input) {
            results.push(input[objectKey]);
        }

        return results.sort(function (e1, e2) {
            return e1.order() - e2.order();
        });
    }
};
module.exports = exports["default"];
//# sourceMappingURL=orderElement.js.map