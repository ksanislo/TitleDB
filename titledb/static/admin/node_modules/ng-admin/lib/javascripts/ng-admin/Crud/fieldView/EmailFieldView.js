'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    getReadWidget: function getReadWidget() {
        return '<ma-string-column value="::value"></ma-string-column>';
    },
    getLinkWidget: function getLinkWidget() {
        return '<a ui-sref="{{detailState}}(detailStateParams)">' + module.exports.getReadWidget() + '</a>';
    },
    getFilterWidget: function getFilterWidget() {
        return '<ma-input-field field="::field" value="value"></ma-input-field>';
    },
    getWriteWidget: function getWriteWidget() {
        return '<ma-input-field type="email" field="::field" value="value"></ma-input-field>';
    }
};
module.exports = exports['default'];
//# sourceMappingURL=EmailFieldView.js.map