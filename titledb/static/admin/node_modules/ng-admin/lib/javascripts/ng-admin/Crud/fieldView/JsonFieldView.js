'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    getReadWidget: function getReadWidget() {
        return '<ma-json-column value="::value"></ma-json-column>';
    },
    getLinkWidget: function getLinkWidget() {
        return 'error: cannot display a json field as linkable';
    },
    getFilterWidget: function getFilterWidget() {
        return '<ma-input-field field="::field" value="value"></ma-input-field>';
    },
    getWriteWidget: function getWriteWidget() {
        return '<ma-json-field field="::field" value="value"></ma-json-field>';
    }
};
module.exports = exports['default'];
//# sourceMappingURL=JsonFieldView.js.map