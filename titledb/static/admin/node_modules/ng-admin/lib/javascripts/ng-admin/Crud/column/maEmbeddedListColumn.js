'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = maEmbeddedListColumn;

var _Entry = require('admin-config/lib/Entry');

var _Entry2 = _interopRequireDefault(_Entry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sorter(sortField, sortDir) {
    return function (entry1, entry2) {
        // use < and > instead of substraction to sort strings properly
        var sortFactor = sortDir === 'DESC' ? -1 : 1;
        if (entry1.values[sortField] > entry2.values[sortField]) {
            return sortFactor;
        }
        if (entry1.values[sortField] < entry2.values[sortField]) {
            return -1 * sortFactor;
        }
        return 0;
    };
}

function maEmbeddedListColumn(NgAdminConfiguration) {
    var application = NgAdminConfiguration(); // jshint ignore:line
    return {
        scope: {
            'field': '&',
            'value': '&',
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
                var sortDir = field.sortDir();
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
                var entries = _Entry2.default.createArrayFromRest(scope.value() || [], targetFields, targetEntityName, targetEntity.identifier().name()).sort(sorter(sortField, sortDir)).filter(filterFunc);
                if (!targetEntityName) {
                    (function () {
                        var index = 0;
                        entries = entries.map(function (e) {
                            e._identifierValue = index++;
                            return e;
                        });
                    })();
                }
                scope.field = field;
                scope.targetFields = targetFields;
                scope.entries = entries;
                scope.entity = targetEntityName ? application.getEntity(targetEntityName) : targetEntity;
                scope.sortField = sortField;
                scope.sortDir = sortDir;
                scope.sort = function (field) {
                    var sortDir = 'ASC';
                    var sortField = field.name();
                    if (scope.sortField === sortField) {
                        // inverse sort dir
                        sortDir = scope.sortDir === 'ASC' ? 'DESC' : 'ASC';
                    }
                    scope.entries = scope.entries.sort(sorter(sortField, sortDir));
                    scope.sortField = sortField;
                    scope.sortDir = sortDir;
                };
            }
        },
        template: '\n<ma-datagrid ng-if="::entries.length > 0"\n    entries="entries"\n    fields="::targetFields"\n    list-actions="::field.listActions()"\n    entity="::entity"\n    datastore="::datastore()"\n    sort-field="sortField"\n    sort-dir="sortDir"\n    sort="::sort">\n</ma-datagrid>'
    };
}

maEmbeddedListColumn.$inject = ['NgAdminConfiguration'];
module.exports = exports['default'];
//# sourceMappingURL=maEmbeddedListColumn.js.map