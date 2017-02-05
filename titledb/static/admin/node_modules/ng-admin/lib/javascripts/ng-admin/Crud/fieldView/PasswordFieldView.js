'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    getReadWidget: function getReadWidget() {
        return 'error: cannot display password field as readable';
    },
    getLinkWidget: function getLinkWidget() {
        return 'error: cannot display password field as linkable';
    },
    getFilterWidget: function getFilterWidget() {
        return 'error: cannot display password field as filter';
    },
    getWriteWidget: function getWriteWidget() {
        return '<ma-input-field type="password" field="::field" value="value"></ma-input-field>';
    }
};
module.exports = exports['default'];
//# sourceMappingURL=PasswordFieldView.js.map