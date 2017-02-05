'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    getReadWidget: function getReadWidget() {
        return '<ma-choices-column values="::entry.listValues[field.name()]"></ma-choices-column>';
    },
    getLinkWidget: function getLinkWidget() {
        return '<ma-reference-many-link-column ids="::value" values="::entry.listValues[field.name()]" field="::field"></ma-reference-many-link-column>';
    },
    getFilterWidget: function getFilterWidget() {
        return '<ma-reference-many-field field="::field" value="value" datastore="::datastore"></ma-reference-many-field>';
    },
    getWriteWidget: function getWriteWidget() {
        return '<ma-reference-many-field field="::field" value="value" datastore="::datastore"></ma-reference-many-field>';
    }
};
module.exports = exports['default'];
//# sourceMappingURL=ReferenceManyFieldView.js.map