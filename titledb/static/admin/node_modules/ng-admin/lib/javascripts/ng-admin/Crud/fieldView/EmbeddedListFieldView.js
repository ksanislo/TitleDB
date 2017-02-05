'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    getReadWidget: function getReadWidget() {
        return '<ma-embedded-list-column field="::field" value="::value" datastore="::datastore"></ma-embedded-list-column>';
    },
    getLinkWidget: function getLinkWidget() {
        return 'error: cannot display referenced_list field as linkable';
    },
    getFilterWidget: function getFilterWidget() {
        return 'error: cannot display referenced_list field as filter';
    },
    getWriteWidget: function getWriteWidget() {
        return '<ma-embedded-list-field field="::field" value="value" datastore="::datastore"></ma-embedded-list-field>';
    }
};
module.exports = exports['default'];
//# sourceMappingURL=EmbeddedListFieldView.js.map