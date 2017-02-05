'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = maReferenceManyField;
function maReferenceManyField(ReferenceRefresher) {
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
            scope.choices = [];

            var setInitialChoices = function setInitialChoices(initialEntries) {
                if (scope.value && scope.value.length) {
                    scope.value.map(function (value) {
                        var isCurrentValueInInitialEntries = initialEntries.filter(function (e) {
                            return e.identifierValue === value;
                        }).length > 0;
                        if (value && !isCurrentValueInInitialEntries) {
                            initialEntries.push(scope.datastore().getEntries(field.targetEntity().uniqueId + '_values').filter(function (entry) {
                                return entry.values[identifierName] == value;
                            }).pop());
                        }
                    });
                }
                var initialChoices = initialEntries.map(function (entry) {
                    return {
                        value: entry.values[identifierName],
                        label: entry.values[field.targetField().name()]
                    };
                });
                scope.$broadcast('choices:update', { choices: initialChoices });
            };

            if (!field.remoteComplete()) {
                // fetch choices from the datastore
                var initialEntries = scope.datastore().getEntries(field.targetEntity().uniqueId + '_choices');
                setInitialChoices(initialEntries);
            } else {
                var _initialEntries = [];
                setInitialChoices(_initialEntries);

                // ui-select doesn't allow to prepopulate autocomplete selects, see https://github.com/angular-ui/ui-select/issues/1197
                // let ui-select fetch the options using the ReferenceRefresher
                scope.refresh = function (search) {
                    return ReferenceRefresher.refresh(field, scope.value, search).then(function (formattedResults) {
                        scope.$broadcast('choices:update', { choices: formattedResults });
                    });
                };
            }
        },
        template: '<ma-choices-field\n                field="field()"\n                datastore="datastore()"\n                refresh="refresh($search)"\n                value="value">\n            </ma-choices-field>'
    };
}

maReferenceManyField.$inject = ['ReferenceRefresher'];
module.exports = exports['default'];
//# sourceMappingURL=maReferenceManyField.js.map