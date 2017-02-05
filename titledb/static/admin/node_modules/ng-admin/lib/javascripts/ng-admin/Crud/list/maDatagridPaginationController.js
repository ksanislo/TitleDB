'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DatagridPaginationController = function () {
    function DatagridPaginationController($scope) {
        _classCallCheck(this, DatagridPaginationController);

        this.$scope = $scope;
        var perPage = parseInt(this.$scope.perPage, 10) || 1,
            totalItems = parseInt(this.$scope.totalItems, 10),
            page = Math.max(parseInt(this.$scope.page, 10), 1);

        this.nbPages = Math.ceil(totalItems / perPage) || 1;
        this.page = Math.min(this.nbPages, page);
        this.offsetEnd = Math.min(this.page * perPage, totalItems);
        this.offsetBegin = Math.min((this.page - 1) * perPage + 1, this.offsetEnd);
        this.totalItems = totalItems;
        this.displayPagination = perPage < totalItems;

        $scope.$on('$destroy', this.destroy.bind(this));
    }

    /**
     * Return an array with the range between min & max, useful for pagination
     *
     * @param {int} min
     * @param {int} max
     * @returns {Array}
     */


    _createClass(DatagridPaginationController, [{
        key: 'range',
        value: function range(page) {
            var input = [],
                nbPages = this.nbPages;

            // display page links around the current page
            if (page > 2) {
                input.push('1');
            }
            if (page == 4) {
                input.push('2');
            }
            if (page > 4) {
                input.push('.');
            }
            if (page > 1) {
                input.push(page - 1);
            }
            input.push(page);
            if (page < nbPages) {
                input.push(page + 1);
            }
            if (page == nbPages - 3) {
                input.push(nbPages - 1);
            }
            if (page < nbPages - 3) {
                input.push('.');
            }
            if (page < nbPages - 1) {
                input.push(nbPages);
            }

            return input;
        }

        /**
         * Link to page number of the list
         *
         * @param {int} number
         */

    }, {
        key: 'setPage',
        value: function setPage(number) {
            if (number <= 0 || number > this.nbPages) {
                return;
            }
            this.$scope.setPage()(number);
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.$scope = undefined;
        }
    }]);

    return DatagridPaginationController;
}();

exports.default = DatagridPaginationController;


DatagridPaginationController.$inject = ['$scope'];
module.exports = exports['default'];
//# sourceMappingURL=maDatagridPaginationController.js.map