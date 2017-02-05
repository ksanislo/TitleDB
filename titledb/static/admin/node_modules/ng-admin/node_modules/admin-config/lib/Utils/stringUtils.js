'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = {
    /**
     * @see http://stackoverflow.com/questions/10425287/convert-string-to-camelcase-with-regular-expression
     * @see http://phpjs.org/functions/ucfirst/
     */
    camelCase: function camelCase(text) {
        if (!text) {
            return text;
        }

        var f = text.charAt(0).toUpperCase();
        text = f + text.substr(1);

        return text.replace(/[-_.\s](.)/g, function (match, group1) {
            return ' ' + group1.toUpperCase();
        });
    }
};
module.exports = exports['default'];
//# sourceMappingURL=stringUtils.js.map