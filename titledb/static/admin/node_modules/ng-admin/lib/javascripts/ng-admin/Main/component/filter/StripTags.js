'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = stripTags;
function stripTags() {
    return function (input) {
        return input.replace(/(<([^>]+)>)/ig, '');
    };
}

stripTags.$inject = [];
module.exports = exports['default'];
//# sourceMappingURL=StripTags.js.map