'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    getReadWidget: function getReadWidget() {
        return '<ma-template-column entry="::entry" field="::field" entity="::entity"></ma-template-column>';
    },
    getLinkWidget: function getLinkWidget() {
        return '<a ui-sref="{{detailState}}(detailStateParams)">' + module.exports.getReadWidget() + '</a>';
    },
    getFilterWidget: function getFilterWidget() {
        return '<ma-template-field field="::field" value="value" values="values" filters="filters"></ma-template-field>';
    },
    getWriteWidget: function getWriteWidget() {
        return '<ma-template-field field="::field" value="value" entry="entry" entity="::entity"></ma-template-field>';
    }
};
module.exports = exports['default'];
//# sourceMappingURL=TemplateFieldView.js.map