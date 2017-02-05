'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = maFilterForm;
function maFilterForm() {
    return {
        restrict: 'E',
        scope: {
            filters: '=',
            datastore: '&',
            values: '=',
            removeFilter: '&'
        },
        link: function link(scope) {
            scope.datastore = scope.datastore();
            scope.removeFilter = scope.removeFilter();
            scope.shouldFilter = function () {
                return Object.keys(scope.filters).length;
            };
        },
        template: '<div class="row">\n    <form class="filters col-md-offset-6 col-md-6 form-horizontal" ng-if="shouldFilter()">\n        <div class="filter {{ field.name() }} form-group input-{{ field.type() }}" ng-repeat="field in filters track by field.name()">\n            <div class="col-sm-1 col-xs-1 remove_filter">\n                <a ng-if="!field.pinned()" ng-click="removeFilter(field)"><span class="glyphicon glyphicon-remove"></span></a>\n            </div>\n            <label for="{{ field.name() }}" class="col-sm-4 col-xs-11 control-label">\n                {{ field.label() | translate }}<span ng-if="field.validation().required">&nbsp;*</span>&nbsp;\n            </label>\n            <div class="col-sm-7" ng-switch="field.type()" ng-class="field.getCssClasses(entry)">\n                <ma-filter field="::field" value="values[field.name()]" values="values" datastore="datastore"></ma-filter>\n            </div>\n        </div>\n    </form>\n</div>'
    };
}

maFilterForm.$inject = [];
module.exports = exports['default'];
//# sourceMappingURL=maFilterForm.js.map