'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @param {$scope} $scope
 * @param {$state} $state
 * @param {PanelBuilder} PanelBuilder
 * @constructor
 */
var DashboardController = function () {
    function DashboardController($scope, $state, collections, entries, hasEntities, dataStore) {
        _classCallCheck(this, DashboardController);

        this.$state = $state;
        this.collections = collections;
        this.entries = entries;
        this.hasEntities = hasEntities;
        this.datastore = dataStore;

        $scope.$on('$destroy', this.destroy.bind(this));
    }

    _createClass(DashboardController, [{
        key: 'gotoList',
        value: function gotoList(entityName) {
            this.$state.go(this.$state.get('list'), { entity: entityName });
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.$state = undefined;
        }
    }]);

    return DashboardController;
}();

exports.default = DashboardController;


DashboardController.$inject = ['$scope', '$state', 'collections', 'entries', 'hasEntities', 'dataStore'];
module.exports = exports['default'];
//# sourceMappingURL=DashboardController.js.map