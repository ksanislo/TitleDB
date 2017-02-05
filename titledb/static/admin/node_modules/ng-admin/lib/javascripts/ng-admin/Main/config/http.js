'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = http;
function http($httpProvider) {
    $httpProvider.useApplyAsync(true);
}

http.$inject = ['$httpProvider'];
module.exports = exports['default'];
//# sourceMappingURL=http.js.map