'use strict';

/*global jasmine,define*/

define('mock/Restangular', ['mixins'], function (mixins) {
    "use strict";

    var Restangular = {
        one: function one() {
            return this;
        },
        oneUrl: function oneUrl() {
            return this;
        },
        all: function all() {
            return this;
        },
        allUrl: function allUrl() {
            return this;
        },
        setBaseUrl: function setBaseUrl() {
            return this;
        },
        setFullResponse: function setFullResponse() {
            return this;
        },
        restangularizeElement: function restangularizeElement() {
            return this;
        },
        get: function get() {
            return mixins.buildPromise({});
        },
        getList: function getList() {
            return mixins.buildPromise({});
        },
        customPOST: function customPOST() {
            return mixins.buildPromise({});
        },
        customPUT: function customPUT() {
            return mixins.buildPromise({});
        },
        customDELETE: function customDELETE() {
            return mixins.buildPromise({});
        }
    };

    return Restangular;
});
//# sourceMappingURL=Restangular.js.map