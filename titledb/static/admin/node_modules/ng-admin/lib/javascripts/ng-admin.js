'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Factory = require('admin-config/lib/Factory');

var _Factory2 = _interopRequireDefault(_Factory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('es6-promise').polyfill(); // for IE

require('./vendors');
require('./ng-admin/Main/MainModule');
require('./ng-admin/Crud/CrudModule');

var moduleName = 'ng-admin';
var factory = angular.module('AdminDescriptionModule', []);
factory.constant('AdminDescription', new _Factory2.default());

var ngadmin = angular.module(moduleName, ['ui.select', 'main', 'crud', 'AdminDescriptionModule']);

ngadmin.config(['NgAdminConfigurationProvider', 'AdminDescription', function (NgAdminConfigurationProvider, AdminDescription) {
    NgAdminConfigurationProvider.setAdminDescription(AdminDescription);
}]);

ngadmin.config(['uiSelectConfig', function (uiSelectConfig) {
    uiSelectConfig.theme = 'bootstrap';
}]);

exports.default = moduleName;
module.exports = exports['default'];
//# sourceMappingURL=ng-admin.js.map