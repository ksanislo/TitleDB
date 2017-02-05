'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NgAdminConfiguration = function () {
    function NgAdminConfiguration($compileProvider) {
        _classCallCheck(this, NgAdminConfiguration);

        this.config = null;
        this.adminDescription = null;
        this.$compileProvider = $compileProvider;
    }

    _createClass(NgAdminConfiguration, [{
        key: 'setAdminDescription',
        value: function setAdminDescription(adminDescription) {
            this.adminDescription = adminDescription;
        }
    }, {
        key: 'configure',
        value: function configure(config) {
            this.config = config;

            this.$compileProvider.debugInfoEnabled(this.config.debug());
        }
    }, {
        key: '$get',
        value: function $get() {
            var config = this.config;
            return function () {
                return config;
            };
        }
    }, {
        key: 'application',
        value: function application(name, debug) {
            return this.adminDescription.application(name, debug);
        }
    }, {
        key: 'entity',
        value: function entity(name) {
            return this.adminDescription.entity(name);
        }
    }, {
        key: 'field',
        value: function field(name, type) {
            return this.adminDescription.field(name, type);
        }
    }, {
        key: 'registerFieldType',
        value: function registerFieldType(name, type) {
            return this.adminDescription.registerFieldType(name, type);
        }
    }, {
        key: 'getFieldConstructor',
        value: function getFieldConstructor(name) {
            return this.adminDescription.getFieldConstructor(name);
        }
    }, {
        key: 'menu',
        value: function menu(entity) {
            return this.adminDescription.menu(entity);
        }
    }, {
        key: 'collection',
        value: function collection(_collection) {
            return this.adminDescription.collection(_collection);
        }
    }, {
        key: 'dashboard',
        value: function dashboard(_dashboard) {
            return this.adminDescription.dashboard(_dashboard);
        }
    }]);

    return NgAdminConfiguration;
}();

exports.default = NgAdminConfiguration;


NgAdminConfiguration.$inject = ['$compileProvider'];
module.exports = exports['default'];
//# sourceMappingURL=NgAdminConfiguration.js.map