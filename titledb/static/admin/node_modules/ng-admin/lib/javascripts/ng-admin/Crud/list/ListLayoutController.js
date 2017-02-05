'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debounce = require('lodash.debounce');

var ListLayoutController = function () {
    function ListLayoutController($scope, $stateParams, $state, $location, $timeout, view, dataStore) {
        var _this = this;

        _classCallCheck(this, ListLayoutController);

        this.$scope = $scope;
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$timeout = $timeout;
        this.view = view;
        this.dataStore = dataStore;
        this.entity = view.getEntity();
        this.actions = view.actions();
        this.batchActions = view.batchActions();
        this.loadingPage = false;
        this.filters = view.filters();
        this.search = ListLayoutController.getCurrentSearchParam($location, this.filters);
        this.path = $location.path();
        // since search isn't a $stateParam of the listLayout state,
        // the controller doesn't change when the search changes
        // so we must update filter values manually when the location changes
        $scope.$watch(function () {
            return $location.search() && $location.search().search;
        }, function (newval, oldval) {
            if (newval === oldval) {
                return;
            }
            if ($location.path() !== _this.path) {
                return; // already transitioned to another page
            }
            _this.enabledFilters = _this.getEnabledFilters();
        });
        // apply filters when filter values change
        $scope.$watch(function () {
            return _this.search;
        }, debounce(function (newValues, oldValues) {
            if (newValues != oldValues) {
                _this.updateFilters();
            }
        }, 500), true);
        this.filters = view.filters();
        this.enabledFilters = this.getEnabledFilters();
        this.hasFilters = Object.keys(this.filters).length > 0;
        this.focusedFilterId = null;
        this.enableFilter = this.enableFilter.bind(this);
        this.removeFilter = this.removeFilter.bind(this);
        if (this.batchActions.length) {
            // required in scope to communicate with listView
            $scope.selectionUpdater = function (selection) {
                return $scope.selection = selection;
            };
            $scope.selection = [];
        }

        $scope.$on('$destroy', this.destroy.bind(this));
    }

    _createClass(ListLayoutController, [{
        key: 'enableFilter',
        value: function enableFilter(filter) {
            var _this2 = this;

            var defaultValue = filter.defaultValue();
            if (defaultValue !== null) {
                this.search[filter.name()] = defaultValue;
            }
            this.enabledFilters.push(filter);
            this.focusedFilterId = filter.name();
            this.$timeout(function () {
                var el = window.document.getElementById(_this2.focusedFilterId);
                if (el && el.focus) {
                    el.focus();
                }
            }, 200, false);
        }
    }, {
        key: 'getEnabledFilters',
        value: function getEnabledFilters() {
            var _this3 = this;

            return this.filters.filter(function (filter) {
                if (filter.pinned()) {
                    return true;
                }
                return _this3.search && filter.name() in _this3.search;
            });
        }
    }, {
        key: 'updateFilters',
        value: function updateFilters() {
            var values = {},
                filters = this.enabledFilters,
                fieldName,
                field,
                i;
            for (i in filters) {
                field = filters[i];
                fieldName = field.name();
                if (this.search[fieldName] === '') {
                    delete this.search[fieldName];
                    continue;
                }

                if (field.type() === 'boolean' && fieldName in this.search || // for boolean false is the same as null
                field.type() !== 'boolean' && this.search[fieldName] !== null) {
                    values[fieldName] = field.getTransformedValue(this.search[fieldName]);
                }
            }
            this.$stateParams.search = values;
            this.$stateParams.page = 1;
            this.$state.go('list', this.$stateParams);
        }
    }, {
        key: 'removeFilter',
        value: function removeFilter(filter) {
            delete this.search[filter.name()];
            this.enabledFilters = this.enabledFilters.filter(function (f) {
                return f !== filter;
            });
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.$scope = undefined;
            this.$state = undefined;
            this.$stateParams = undefined;
            this.$timeout = undefined;
            this.dataStore = undefined;
        }
    }], [{
        key: 'getCurrentSearchParam',
        value: function getCurrentSearchParam(location, filters) {
            var baseSearch = location.search().search ? JSON.parse(location.search().search) : {};

            return filters.reduce(function (search, filter) {
                if (typeof search[filter.name()] !== 'undefined') {
                    return _extends({}, search, _defineProperty({}, filter.name(), filter.getMappedValue(search[filter.name()])));
                }
                if (filter.pinned() && !search[filter.name()] && filter.defaultValue()) {
                    return _extends({}, search, _defineProperty({}, filter.name(), filter.getMappedValue(filter.defaultValue())));
                }
                return search;
            }, baseSearch);
        }
    }]);

    return ListLayoutController;
}();

exports.default = ListLayoutController;


ListLayoutController.$inject = ['$scope', '$stateParams', '$state', '$location', '$timeout', 'view', 'dataStore'];
module.exports = exports['default'];
//# sourceMappingURL=ListLayoutController.js.map