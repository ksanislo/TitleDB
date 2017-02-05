"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FieldViewConfiguration = function () {
    function FieldViewConfiguration() {
        _classCallCheck(this, FieldViewConfiguration);

        this.fieldViews = {};
    }

    _createClass(FieldViewConfiguration, [{
        key: "registerFieldView",
        value: function registerFieldView(type, FieldView) {
            this.fieldViews[type] = FieldView;
        }
    }, {
        key: "$get",
        value: function $get() {
            return this.fieldViews;
        }
    }]);

    return FieldViewConfiguration;
}();

exports.default = FieldViewConfiguration;


FieldViewConfiguration.$inject = [];
module.exports = exports["default"];
//# sourceMappingURL=FieldViewConfiguration.js.map