"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Dashboard = (function () {
    function Dashboard() {
        _classCallCheck(this, Dashboard);

        this._collections = {};
        this._template = null;
    }

    _createClass(Dashboard, [{
        key: "addCollection",
        value: function addCollection(collection) {
            this._collections[collection.name()] = collection;
            return this;
        }
    }, {
        key: "collections",
        value: function collections(_collections) {
            if (arguments.length) {
                this._collections = _collections;
                return this;
            }
            return this._collections;
        }
    }, {
        key: "hasCollections",
        value: function hasCollections() {
            return Object.keys(this._collections).length > 0;
        }
    }, {
        key: "template",
        value: function template(_template) {
            if (arguments.length) {
                this._template = _template;
                return this;
            }
            return this._template;
        }
    }]);

    return Dashboard;
})();

exports["default"] = Dashboard;
module.exports = exports["default"];
//# sourceMappingURL=Dashboard.js.map