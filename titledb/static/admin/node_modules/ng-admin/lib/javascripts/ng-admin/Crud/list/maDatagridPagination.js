'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = maDatagridPagination;

var _maDatagridPagination = require('./maDatagridPagination.html');

var _maDatagridPagination2 = _interopRequireDefault(_maDatagridPagination);

var _maDatagridPaginationController = require('./maDatagridPaginationController');

var _maDatagridPaginationController2 = _interopRequireDefault(_maDatagridPaginationController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function maDatagridPagination() {
    return {
        restrict: 'E',
        scope: {
            page: '@',
            perPage: '@',
            totalItems: '@',
            setPage: '&'
        },
        template: _maDatagridPagination2.default,
        controllerAs: 'paginationCtrl',
        controller: _maDatagridPaginationController2.default
    };
}

maDatagridPagination.$inject = [];
module.exports = exports['default'];
//# sourceMappingURL=maDatagridPagination.js.map