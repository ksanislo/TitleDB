'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    getReadWidget: function getReadWidget() {
        return '<ma-boolean-column value="::value"></ma-boolean-column>';
    },
    getLinkWidget: function getLinkWidget() {
        return '<a ui-sref="{{detailState}}(detailStateParams)">' + module.exports.getReadWidget() + '</a>';
    },
    getFilterWidget: function getFilterWidget() {
        return '<ma-choice-field field="::field" value="value" choices="::field.filterChoices()"></ma-choice-field>';
    },
    getWriteWidget: function getWriteWidget() {
        return '<div class="row">\n        <ma-choice-field class="col-sm-4 col-md-3" ng-if="!field.validation().required" field="::field" value="$parent.value"></ma-choice-field>\n        <ma-checkbox-field class="col-sm-4 col-md-3" ng-if="!!field.validation().required" field="::field" value="$parent.value"></ma-checkbox-field>\n    </div>';
    }
};
module.exports = exports['default'];
//# sourceMappingURL=BooleanFieldView.js.map