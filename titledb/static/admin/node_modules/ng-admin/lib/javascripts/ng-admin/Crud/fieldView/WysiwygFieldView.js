'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    getReadWidget: function getReadWidget() {
        return '<ma-wysiwyg-column field="::field" value="::value"></ma-wysiwyg-column>';
    },
    getLinkWidget: function getLinkWidget() {
        return '<a ui-sref="{{detailState}}(detailStateParams)">' + module.exports.getReadWidget() + '</a>';
    },
    getFilterWidget: function getFilterWidget() {
        return '<ma-input-field field="::field" value="value"></ma-input-field>';
    },
    getWriteWidget: function getWriteWidget() {
        return '<ma-wysiwyg-field field="::field" value="value"></ma-wysiwyg-field>';
    }
};
module.exports = exports['default'];
//# sourceMappingURL=WysiwygFieldView.js.map