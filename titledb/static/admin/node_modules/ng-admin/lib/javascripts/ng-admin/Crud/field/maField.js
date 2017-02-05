'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = maField;
function maField(FieldViewConfiguration, $compile) {
    return {
        restrict: 'E',
        scope: {
            field: '&',
            entry: '=',
            value: '=',
            entity: '&',
            form: '&',
            datastore: '&'
        },
        link: function link(scope, element) {
            var field = scope.field();
            var type = field.type();
            scope.field = field;
            scope.type = type;
            scope.entity = scope.entity();
            scope.form = scope.form();
            scope.datastore = scope.datastore();
            scope.getCssClasses = function (entry) {
                return 'ng-admin-field-' + field.name().replace('.', '_') + ' ng-admin-type-' + type + ' ' + (field.getCssClasses(entry) || 'col-sm-10 col-md-8 col-lg-7');
            };

            scope.getInput = function () {
                return scope.form[field.name()];
            };

            /**
             * Should validation status be displayed for a given field?
             *
             * - No for non-editable fields, or template fields which not have a corresponding input
             * - No for non-altered input
             * - Yes otherwise
             */
            scope.fieldHasValidation = function () {
                var input = this.getInput();
                return input && input.$dirty;
            };

            scope.fieldIsValid = function () {
                var input = this.getInput();
                return input && input.$valid;
            };

            scope.getFieldValidationClass = function () {
                if (this.fieldHasValidation()) {
                    return this.fieldIsValid() ? 'has-success' : 'has-error';
                }
            };

            var fieldTemplate;
            if (scope.field.editable()) {
                fieldTemplate = '<div ng-class="getCssClasses(entry)">\n    ' + (!field.templateIncludesLabel() && field.getTemplateValue(scope.entry) || FieldViewConfiguration[type].getWriteWidget()) + '\n    <span ng-show="fieldHasValidation()" class="glyphicon form-control-feedback" ng-class="fieldIsValid() ? \'glyphicon-ok\' : \'glyphicon-remove\'"></span>\n</div>';
            } else {
                fieldTemplate = '<div ng-class="field.getCssClasses(entry)||\'col-sm-10\'">\n    <p class="form-control-static">\n        <ma-column field="::field" entry="::entry" entity="::entity" datastore="::datastore"></ma-column>\n    </p>\n</div>';
            }

            var template = '<div id="row-{{ field.name() }}" class="form-field form-group has-feedback" ng-class="getFieldValidationClass()">\n    <label for="{{ field.name() }}" class="col-sm-2 control-label">\n        {{ field.label() | translate }}<span ng-if="field.validation().required">&nbsp;*</span>&nbsp;\n    </label>\n    ' + fieldTemplate + '\n</div>';

            element.append(template);
            $compile(element.contents())(scope);
        }
    };
}

maField.$inject = ['FieldViewConfiguration', '$compile'];
module.exports = exports['default'];
//# sourceMappingURL=maField.js.map