'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    getReadWidget: function getReadWidget() {
        return '<ma-reference-column field="::field" value="::value" datastore="::datastore"></ma-reference-column>';
    },
    getLinkWidget: function getLinkWidget() {
        return '<ma-reference-link-column entry="::entry" field="::field" value="::value" datastore="::datastore"></ma-reference-link-column>';
    },
    getFilterWidget: function getFilterWidget() {
        return '<ma-reference-field field="::field" value="value" datastore="::datastore"></ma-reference-field>';
    },
    getWriteWidget: function getWriteWidget() {
        return '<ma-reference-field field="::field" value="value" datastore="::datastore"></ma-reference-field>';
    }
};
module.exports = exports['default'];
//# sourceMappingURL=ReferenceFieldView.js.map