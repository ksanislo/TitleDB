'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    getReadWidget: function getReadWidget() {
        return '<ma-choices-column values="::value"></ma-choices-column>';
    },
    getLinkWidget: function getLinkWidget() {
        return '<a ui-sref="{{detailState}}(detailStateParams)">' + module.exports.getReadWidget() + '</a>';
    },
    getFilterWidget: function getFilterWidget() {
        return '<ma-choices-field field="::field" value="value"></ma-choices-field>';
    },
    getWriteWidget: function getWriteWidget() {
        return '<ma-choices-field field="::field" entry="::entry" value="value"></ma-choices-field>';
    }
};
module.exports = exports['default'];
//# sourceMappingURL=ChoicesFieldView.js.map