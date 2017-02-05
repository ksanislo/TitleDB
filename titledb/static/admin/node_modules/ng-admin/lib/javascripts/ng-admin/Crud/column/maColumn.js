'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = maColumn;
function maColumn($state, $anchorScroll, $compile, Configuration, FieldViewConfiguration) {

    function getDetailLinkRouteName(field, entity) {
        if (entity.isReadOnly) {
            return entity.showView().enabled ? 'show' : false;
        }
        if (field.detailLinkRoute() == 'edit' && entity.editionView().enabled) {
            return 'edit';
        }
        return entity.showView().enabled ? 'show' : false;
    }

    function isDetailLink(field, entity) {
        if (field.isDetailLink() === false) {
            return false;
        }
        if (field.type() == 'reference' || field.type() == 'reference_many') {
            var relatedEntity = Configuration().getEntity(field.targetEntity().name());
            if (!relatedEntity) {
                return false;
            }
            return getDetailLinkRouteName(field, relatedEntity) !== false;
        }
        return getDetailLinkRouteName(field, entity) !== false;
    }

    return {
        restrict: 'E',
        scope: {
            field: '&',
            entry: '&',
            entity: '&',
            datastore: '&'
        },
        link: function link(scope, element) {
            scope.datastore = scope.datastore();
            scope.field = scope.field();
            scope.entry = scope.entry();
            scope.value = typeof scope.entry === 'undefined' ? '' : scope.entry.values[scope.field.name()];
            scope.entity = scope.entity();
            var customTemplate = scope.field.getTemplateValue(scope.entry);
            if (customTemplate && !scope.field.templateIncludesLabel()) {
                element.append(customTemplate);
            } else {
                var type = scope.field.type();
                if (isDetailLink(scope.field, scope.entity)) {
                    element.append(FieldViewConfiguration[type].getLinkWidget());
                } else {
                    element.append(FieldViewConfiguration[type].getReadWidget());
                }
            }
            scope.detailState = false;
            scope.detailStateParams = {};
            if (typeof scope.entry !== 'undefined') {
                scope.detailState = getDetailLinkRouteName(scope.field, scope.entity);
                scope.detailStateParams = _extends({}, $state.params, {
                    entity: scope.entry.entityName,
                    id: scope.entry.identifierValue
                });
            }
            $compile(element.contents())(scope);
        }
    };
}

maColumn.$inject = ['$state', '$anchorScroll', '$compile', 'NgAdminConfiguration', 'FieldViewConfiguration'];
module.exports = exports['default'];
//# sourceMappingURL=maColumn.js.map