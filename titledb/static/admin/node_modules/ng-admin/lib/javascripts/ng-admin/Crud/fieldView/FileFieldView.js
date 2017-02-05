'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    getReadWidget: function getReadWidget() {
        return 'error: cannot display file field as readable';
    },
    getLinkWidget: function getLinkWidget() {
        return 'error: cannot display file field as linkable';
    },
    getFilterWidget: function getFilterWidget() {
        return 'error: cannot display file field as filter';
    },
    getWriteWidget: function getWriteWidget() {
        return '<ma-file-field field="::field" value="value"></ma-file-field>';
    }
};
module.exports = exports['default'];
//# sourceMappingURL=FileFieldView.js.map