'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = maEmbeddedListField;

var _Entry = require('admin-config/lib/Entry');

var _Entry2 = _interopRequireDefault(_Entry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function maEmbeddedListField() {
    return {
        scope: {
            'field': '&',
            'value': '=',
            'datastore': '&'
        },
        restrict: 'E',
        link: {
            pre: function pre(scope) {
                var field = scope.field();
                var targetEntity = field.targetEntity();
                var targetEntityName = targetEntity.name();
                var targetFields = field.targetFields();
                var sortField = field.sortField();
                var sortDir = field.sortDir() === 'DESC' ? -1 : 1;
                var filterFunc;
                if (field.permanentFilters()) {
                    (function () {
                        var filters = field.permanentFilters();
                        var filterKeys = Object.keys(filters);
                        filterFunc = function filterFunc(entry) {
                            return filterKeys.reduce(function (isFiltered, key) {
                                return isFiltered && entry.values[key] === filters[key];
                            }, true);
                        };
                    })();
                } else {
                    filterFunc = function filterFunc() {
                        return true;
                    };
                }
                scope.fields = targetFields;
                scope.targetEntity = targetEntity;
                scope.entries = _Entry2.default.createArrayFromRest(scope.value || [], targetFields, targetEntityName, targetEntity.identifier().name()).sort(function (entry1, entry2) {
                    // use < and > instead of substraction to sort strings properly
                    if (entry1.values[sortField] > entry2.values[sortField]) {
                        return sortDir;
                    }
                    if (entry1.values[sortField] < entry2.values[sortField]) {
                        return -1 * sortDir;
                    }
                    return 0;
                }).filter(filterFunc);
                scope.addNew = function () {
                    return scope.entries.push(_Entry2.default.createForFields(targetFields));
                };
                scope.remove = function (entry) {
                    scope.entries = scope.entries.filter(function (e) {
                        return e !== entry;
                    });
                };
                scope.$watch('entries', function (newEntries, oldEntries) {
                    if (newEntries === oldEntries) {
                        return;
                    }
                    scope.value = newEntries.map(function (e) {
                        return e.transformToRest(targetFields);
                    });
                }, true);
            }
        },
        template: '\n<div class="row"><div class="col-sm-12">\n    <ng-form ng-repeat="entry in entries track by $index" class="subentry" name="subform_{{$index}}" ng-init="formName = \'subform_\' + $index">\n        <div class="remove_button_container">\n            <a class="btn btn-default btn-sm" ng-click="remove(entry)"><span class="glyphicon glyphicon-minus-sign" aria-hidden="true"></span>&nbsp;<span translate="REMOVE"></span></a>\n        </div>\n        <div class="form-field form-group" ng-repeat="field in ::fields track by $index">\n            <ma-field field="::field" value="entry.values[field.name()]" entry="entry" entity="::targetEntity" form="formName" datastore="::datastore()"></ma-field>\n        </div>\n        <hr/>\n    </ng-form>\n    <div class="form-group">\n        <div class="col-sm-offset-2 col-sm-10">\n            <a class="btn btn-default btn-sm" ng-click="addNew()"><span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span>&nbsp;<span translate="ADD_NEW" translate-values="{ name: field().label().toLowerCase() }"></span></a>\n        </div>\n    </div>\n</div></div>'
    };
}

maEmbeddedListField.$inject = [];
module.exports = exports['default'];
//# sourceMappingURL=maEmbeddedListField.js.map