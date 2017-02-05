'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ShowController = function () {
    function ShowController($scope, $location, view, dataStore) {
        _classCallCheck(this, ShowController);

        this.$scope = $scope;
        this.$location = $location;
        this.title = view.title();
        this.description = view.description();
        this.actions = view.actions();

        this.fields = view.fields();
        this.$scope.entry = dataStore.getFirstEntry(view.getEntity().uniqueId);
        this.$scope.view = view;
        this.view = view;
        this.entity = this.view.getEntity();
        this.dataStore = dataStore;

        $scope.$on('$destroy', this.destroy.bind(this));
    }

    _createClass(ShowController, [{
        key: 'destroy',
        value: function destroy() {
            this.$scope = undefined;
            this.$location = undefined;
            this.view = undefined;
            this.entity = undefined;
            this.dataStore = undefined;
        }
    }]);

    return ShowController;
}();

exports.default = ShowController;


ShowController.$inject = ['$scope', '$location', 'view', 'dataStore'];
module.exports = exports['default'];
//# sourceMappingURL=ShowController.js.map