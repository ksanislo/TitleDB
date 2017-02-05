'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = maReferenceField;
function maReferenceField(ReferenceRefresher) {
    return {
        scope: {
            'field': '&',
            'value': '=',
            'entry': '=?',
            'datastore': '&?'
        },
        restrict: 'E',
        link: function link(scope) {
            var field = scope.field();
            var identifierName = field.targetEntity().identifier().name();
            scope.name = field.name();
            scope.v = field.validation();

            if (!field.remoteComplete()) {
                // fetch choices from the datastore, populated during routing resolve
                var initialEntries = scope.datastore().getEntries(field.targetEntity().uniqueId + '_choices');
                if (scope.value) {
                    var isCurrentValueInInitialEntries = initialEntries.filter(function (e) {
                        return e.identifierValue === scope.value;
                    }).length > 0;
                    if (!isCurrentValueInInitialEntries) {
                        initialEntries.unshift(scope.datastore().getEntries(field.targetEntity().uniqueId + '_values').find(function (entry) {
                            return entry.values[identifierName] == scope.value;
                        }));
                    }
                }
                var initialChoices = initialEntries.map(function (entry) {
                    return {
                        value: entry.values[identifierName],
                        label: entry.values[field.targetField().name()]
                    };
                });
                scope.$broadcast('choices:update', { choices: initialChoices });
            } else {
                // ui-select doesn't allow to prepopulate autocomplete selects, see https://github.com/angular-ui/ui-select/issues/1197
                // let ui-select fetch the options using the ReferenceRefresher
                scope.refresh = function refresh(search) {
                    return ReferenceRefresher.refresh(field, scope.value, search).then(function addCurrentChoice(results) {
                        if (!search && scope.value) {
                            var isCurrentValueInEntries = results.filter(function (e) {
                                return e.value === scope.value;
                            }).length > 0;
                            if (!isCurrentValueInEntries) {
                                var currentEntry = scope.datastore().getEntries(field.targetEntity().uniqueId + '_values').find(function (entry) {
                                    return entry.values[identifierName] == scope.value;
                                });
                                results.unshift({
                                    value: currentEntry.values[identifierName],
                                    label: currentEntry.values[field.targetField().name()]
                                });
                            }
                        }
                        return results;
                    }).then(function (formattedResults) {
                        scope.$broadcast('choices:update', { choices: formattedResults });
                    });
                };
            }
        },
        template: '<ma-choice-field\n                field="field()"\n                datastore="datastore()"\n                refresh="refresh($search)"\n                value="value">\n            </ma-choice-field>'
    };
}

maReferenceField.$inject = ['ReferenceRefresher'];
module.exports = exports['default'];
//# sourceMappingURL=maReferenceField.js.map