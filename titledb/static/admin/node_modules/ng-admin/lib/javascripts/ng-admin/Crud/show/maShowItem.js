'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = maShowItem;
/**
 * A directive containing a label and a column
 *
 * To be used in the showView
 */
function maShowItem() {
    return {
        restrict: 'E',
        scope: {
            field: '&',
            entry: '&',
            entity: '&',
            datastore: '&'
        },
        link: {
            pre: function pre(scope) {
                scope.field = scope.field();
                scope.entry = scope.entry();
                scope.entity = scope.entity();
                scope.datastore = scope.datastore();
            }
        },
        template: '<div class="col-lg-12 form-group">\n    <label class="col-sm-2 control-label">{{ field.label() | translate }}</label>\n    <div class="show-value" ng-class="(field.getCssClasses(entry) || \'col-sm-10 col-md-8 col-lg-7\')">\n        <div ng-class="::\'ng-admin-field-\' + field.name() + \' \' + \'ng-admin-type-\' + field.type()">\n            <ma-column field="::field" entry="::entry" entity="::entity" datastore="::datastore"></ma-column>\n        </div>\n    </div>\n</div>'
    };
}

maShowItem.$inject = [];
module.exports = exports['default'];
//# sourceMappingURL=maShowItem.js.map