'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RestWrapper = function () {
    function RestWrapper(Restangular) {
        _classCallCheck(this, RestWrapper);

        this.Restangular = Restangular;

        Restangular.setFullResponse(true);
    }

    /**
     * Returns the promise of one resource by URL
     *
     * @param {String} entityName
     * @param {String} url
     *
     * @returns {promise}
     */


    _createClass(RestWrapper, [{
        key: 'getOne',
        value: function getOne(entityName, url) {
            return this.Restangular.oneUrl(entityName, url).get().then(function (response) {
                return response.data;
            });
        }

        /**
         * Returns the promise of a list of resources
         *
         * @param {Object} params
         * @param {String} entityName
         * @param {String} url
         *
         * @returns {promise}
         */

    }, {
        key: 'getList',
        value: function getList(params, entityName, url) {
            return this.Restangular.allUrl(entityName, url).getList(params);
        }
    }, {
        key: 'createOne',
        value: function createOne(rawEntity, entityName, url, method) {
            var resource = this.Restangular.oneUrl(entityName, url),
                operation = method ? resource.customOperation(method, null, {}, {}, rawEntity) : resource.customPOST(rawEntity);

            return operation.then(function (response) {
                return response.data;
            });
        }
    }, {
        key: 'updateOne',
        value: function updateOne(rawEntity, entityName, url, method) {
            var resource = this.Restangular.oneUrl(entityName, url),
                operation = method ? resource.customOperation(method, null, {}, {}, rawEntity) : resource.customPUT(rawEntity);

            return operation.then(function (response) {
                return response.data;
            });
        }
    }, {
        key: 'deleteOne',
        value: function deleteOne(entityName, url) {
            return this.Restangular.oneUrl(entityName, url).customDELETE();
        }
    }]);

    return RestWrapper;
}();

exports.default = RestWrapper;


RestWrapper.$inject = ['Restangular'];
module.exports = exports['default'];
//# sourceMappingURL=RestWrapper.js.map