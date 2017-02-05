'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    getReadWidget: function getReadWidget() {
        return '<ma-referenced-list-column field="::field" datastore="::datastore"></ma-referenced-list-column>';
    },
    getLinkWidget: function getLinkWidget() {
        return 'error: cannot display referenced_list field as linkable';
    },
    getFilterWidget: function getFilterWidget() {
        return 'error: cannot display referenced_list field as filter';
    },
    getWriteWidget: function getWriteWidget() {
        return '<ma-referenced-list-column field="::field" datastore="::datastore"></ma-referenced-list-column>';
    }
};
module.exports = exports['default'];
//# sourceMappingURL=ReferencedListFieldView.js.map