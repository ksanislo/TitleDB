'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DatagridController = function () {
    function DatagridController($scope, $location, $stateParams, $anchorScroll) {
        _classCallCheck(this, DatagridController);

        $scope.entity = $scope.entity();
        this.$scope = $scope;
        this.$location = $location;
        this.$anchorScroll = $anchorScroll;
        this.datastore = this.$scope.datastore();
        this.filters = {};
        this.shouldDisplayActions = this.$scope.listActions() && this.$scope.listActions().length > 0;
        $scope.getEntryCssClasses = this.getEntryCssClasses.bind(this);
        $scope.toggleSelect = this.toggleSelect.bind(this);
        $scope.toggleSelectAll = this.toggleSelectAll.bind(this);
        this.sortField = $scope.sortField();
        this.sortDir = $scope.sortDir();
        this.sortCallback = $scope.sort() ? $scope.sort() : this.sort.bind(this);
    }

    /**
     * Return true if a column is being sorted
     *
     * @param {Field} field
     *
     * @returns {Boolean}
     */


    _createClass(DatagridController, [{
        key: 'isSorting',
        value: function isSorting(field) {
            return this.$scope.sortField() === this.getSortName(field);
        }

        /**
         * Return 'even'|'odd' based on the index parameter
         *
         * @param {Number} index
         * @returns {string}
         */

    }, {
        key: 'itemClass',
        value: function itemClass(index) {
            return index % 2 === 0 ? 'even' : 'odd';
        }

        /**
         *
         * @param {Field} field
         */

    }, {
        key: 'sort',
        value: function sort(field) {
            var dir = 'ASC',
                fieldName = this.getSortName(field);

            if (this.sortField === fieldName) {
                dir = this.sortDir === 'ASC' ? 'DESC' : 'ASC';
            }

            this.$location.search('sortField', fieldName);
            this.$location.search('sortDir', dir);
        }

        /**
         * Return fieldName like (view.fieldName) to sort
         *
         * @param {Field} field
         *
         * @returns {String}
         */

    }, {
        key: 'getSortName',
        value: function getSortName(field) {
            return this.$scope.name ? this.$scope.name + '.' + field.name() : field.name();
        }
    }, {
        key: 'getEntryCssClasses',
        value: function getEntryCssClasses(entry) {
            var entryCssClasses = this.$scope.entryCssClasses;
            if (typeof entryCssClasses !== 'function') {
                return;
            }
            var getEntryCssClasses = entryCssClasses();
            if (typeof getEntryCssClasses !== 'function') {
                return;
            }
            return getEntryCssClasses(entry.values);
        }
    }, {
        key: 'toggleSelect',
        value: function toggleSelect(entry) {
            var selection = this.$scope.selection.slice();

            var index = selection.indexOf(entry);

            if (index === -1) {
                this.$scope.selection = selection.concat(entry);
                return;
            }
            selection.splice(index, 1);
            this.$scope.selection = selection;
        }
    }, {
        key: 'toggleSelectAll',
        value: function toggleSelectAll() {

            if (this.$scope.selection.length < this.$scope.entries.length) {
                this.$scope.selection = this.$scope.entries;
                return;
            }

            this.$scope.selection = [];
        }
    }]);

    return DatagridController;
}();

exports.default = DatagridController;


DatagridController.$inject = ['$scope', '$location', '$stateParams', '$anchorScroll'];
module.exports = exports['default'];
//# sourceMappingURL=maDatagridController.js.map