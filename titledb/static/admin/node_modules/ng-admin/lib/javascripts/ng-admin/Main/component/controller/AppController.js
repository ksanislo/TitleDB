'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @param {$scope}  $scope
 * @param {$state}  $state
 * @param {NgAdmin} Configuration
 * @constructor
 */
var AppController = function () {
    function AppController($scope, $state, Configuration) {
        _classCallCheck(this, AppController);

        var application = Configuration();
        this.$scope = $scope;
        this.$state = $state;
        this.$scope.isCollapsed = true;
        this.menu = application.menu();
        this.applicationName = application.title();
        this.header = application.header();

        $scope.$on('$destroy', this.destroy.bind(this));
    }

    _createClass(AppController, [{
        key: 'displayHome',
        value: function displayHome() {
            this.$state.go(this.$state.get('dashboard'));
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.$scope = undefined;
            this.$state = undefined;
        }
    }]);

    return AppController;
}();

exports.default = AppController;


AppController.$inject = ['$scope', '$state', 'NgAdminConfiguration'];
module.exports = exports['default'];
//# sourceMappingURL=AppController.js.map