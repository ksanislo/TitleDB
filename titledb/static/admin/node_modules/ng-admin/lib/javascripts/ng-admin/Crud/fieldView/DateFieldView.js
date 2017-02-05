'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    getReadWidget: function getReadWidget() {
        return '<ma-date-column field="::field" value="::value"></ma-date-column>';
    },
    getLinkWidget: function getLinkWidget() {
        return '<a ui-sref="{{detailState}}(detailStateParams)">' + module.exports.getReadWidget() + '</a>';
    },
    getFilterWidget: function getFilterWidget() {
        return '<ma-date-field field="::field" value="value"></ma-date-field>';
    },
    getWriteWidget: function getWriteWidget() {
        return '<div class="date_widget"><ma-date-field field="::field" value="value"></ma-date-field></div>';
    }
};
module.exports = exports['default'];
//# sourceMappingURL=DateFieldView.js.map