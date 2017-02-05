'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    getReadWidget: function getReadWidget() {
        return '<ma-string-column value="::field.getLabelForChoice(value, entry)"></ma-string-column>';
    },
    getLinkWidget: function getLinkWidget() {
        return '<a ui-sref="{{detailState}}(detailStateParams)">' + module.exports.getReadWidget() + '</a>';
    },
    getFilterWidget: function getFilterWidget() {
        return '<ma-choice-field field="::field" value="value"></ma-choice-field>';
    },
    getWriteWidget: function getWriteWidget() {
        return '<ma-choice-field field="::field" entry="entry" value="value"></ma-choice-field>';
    }
};
module.exports = exports['default'];
//# sourceMappingURL=ChoiceFieldView.js.map