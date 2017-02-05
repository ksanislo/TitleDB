'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Entry = require('admin-config/lib/Entry');

var _Entry2 = _interopRequireDefault(_Entry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ListController = function () {
    function ListController($scope, $stateParams, $location, $anchorScroll, ReadQueries, progression, view, dataStore, totalItems) {
        _classCallCheck(this, ListController);

        this.$scope = $scope;
        this.$stateParams = $stateParams;
        this.$location = $location;
        this.$anchorScroll = $anchorScroll;
        this.ReadQueries = ReadQueries;
        this.progression = progression;
        this.view = view;
        this.entity = view.getEntity();
        this.loadingPage = false;
        this.search = $stateParams.search;
        this.dataStore = dataStore;
        this.fields = view.fields();
        this.listActions = view.listActions();
        this.totalItems = totalItems;
        this.page = $stateParams.page || 1;
        this.infinitePagination = this.view.infinitePagination();
        this.entryCssClasses = this.view.getEntryCssClasses.bind(this.view);
        this.nextPageCallback = this.nextPage.bind(this);
        this.setPageCallback = this.setPage.bind(this);
        this.sortField = this.$stateParams.sortField || this.view.getSortFieldName();
        this.sortDir = this.$stateParams.sortDir || this.view.sortDir();
        this.queryPromises = [];

        if ($scope.selectionUpdater) {
            $scope.selection = $scope.selection || [];
            $scope.$watch('selection', $scope.selectionUpdater);
        } else {
            $scope.selection = null;
        }

        $scope.$on('$destroy', this.destroy.bind(this));
    }

    _createClass(ListController, [{
        key: 'nextPage',
        value: function nextPage(page) {
            var _this = this;

            if (this.loadingPage) {
                return;
            }

            var view = this.view,
                dataStore = this.dataStore;

            this.progression.start();

            var references = view.getReferences();
            var data = void 0;

            var queryPromise = this.ReadQueries.getAll(view, page, this.search, this.sortField, this.sortDir).then(function (response) {
                data = response.data;
                return _this.ReadQueries.getReferenceData(view.fields(), data);
            }).then(function (referenceData) {
                _this.progression.done();

                for (var name in referenceData) {
                    _Entry2.default.createArrayFromRest(referenceData[name], [references[name].targetField()], references[name].targetEntity().name(), references[name].targetEntity().identifier().name()).map(function (entry) {
                        return dataStore.addEntry(references[name].targetEntity().uniqueId + '_values', entry);
                    });
                }
            });
            this.queryPromises.push(queryPromise);
            // make sure all preceding promises complete before loading data into store
            Promise.all(this.queryPromises).then(function () {
                view.mapEntries(data).map(function (entry) {
                    dataStore.fillReferencesValuesFromEntry(entry, references, true);
                    dataStore.addEntry(_this.entity.uniqueId, entry);
                });

                _this.loadingPage = false;
            });
        }
    }, {
        key: 'setPage',
        value: function setPage(number) {
            this.$location.search('page', number);
            this.$anchorScroll(0);
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.$scope = undefined;
            this.$stateParams = undefined;
            this.$location = undefined;
            this.$anchorScroll = undefined;
            this.dataStore = undefined;
        }
    }]);

    return ListController;
}();

exports.default = ListController;


ListController.$inject = ['$scope', '$stateParams', '$location', '$anchorScroll', 'ReadQueries', 'progression', 'view', 'dataStore', 'totalItems'];
module.exports = exports['default'];
//# sourceMappingURL=ListController.js.map