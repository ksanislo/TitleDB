'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _EntityEntity = require('../Entity/Entity');

var _EntityEntity2 = _interopRequireDefault(_EntityEntity);

function alwaysFalse() {
    return false;
}

var uuid = 0;
var _autoClose = true;

var Menu = (function () {
    function Menu() {
        _classCallCheck(this, Menu);

        this._link = null;
        this._activeFunc = alwaysFalse;
        this._title = null;
        this._icon = false;
        this._children = [];
        this._template = false;
        this._autoClose = true;
        this.uuid = uuid++;
    }

    _createClass(Menu, [{
        key: 'title',
        value: function title() {
            if (arguments.length) {
                this._title = arguments[0];
                return this;
            }
            return this._title;
        }
    }, {
        key: 'isLink',
        value: function isLink() {
            return !!this._link;
        }
    }, {
        key: 'link',
        value: function link() {
            var _this = this;

            if (arguments.length) {
                this._link = arguments[0];
                if (this._activeFunc == alwaysFalse) {
                    this._activeFunc = function (url) {
                        return url.indexOf(_this._link) === 0;
                    };
                }
                return this;
            }
            return this._link;
        }
    }, {
        key: 'autoClose',
        value: function autoClose() {
            if (arguments.length) {
                _autoClose = arguments[0];
                return this;
            }
            return _autoClose;
        }
    }, {
        key: 'active',
        value: function active(activeFunc) {
            if (arguments.length) {
                this._activeFunc = arguments[0];
                return this;
            }
            return this._activeFunc;
        }
    }, {
        key: 'isActive',
        value: function isActive(url) {
            return this._activeFunc(url);
        }
    }, {
        key: 'isChildActive',
        value: function isChildActive(url) {
            return this.isActive(url) || this.children().filter(function (menu) {
                return menu.isChildActive(url);
            }).length > 0;
        }
    }, {
        key: 'addChild',
        value: function addChild(child) {
            if (!(child instanceof Menu)) {
                throw new Error('Only Menu instances are accepted as children of a Menu');
            }
            this._children.push(child);
            return this;
        }
    }, {
        key: 'hasChild',
        value: function hasChild() {
            return this._children.length > 0;
        }
    }, {
        key: 'getChildByTitle',
        value: function getChildByTitle(title) {
            return this.children().filter(function (child) {
                return child.title() == title;
            }).pop();
        }
    }, {
        key: 'children',
        value: function children() {
            if (arguments.length) {
                this._children = arguments[0];
                return this;
            }
            return this._children;
        }
    }, {
        key: 'icon',
        value: function icon() {
            if (arguments.length) {
                this._icon = arguments[0];
                return this;
            }
            return this._icon;
        }
    }, {
        key: 'template',
        value: function template() {
            if (arguments.length) {
                this._template = arguments[0];
                return this;
            }
            return this._template;
        }
    }, {
        key: 'populateFromEntity',
        value: function populateFromEntity(entity) {
            if (!(entity instanceof _EntityEntity2['default'])) {
                throw new Error('populateFromEntity() only accepts an Entity parameter');
            }
            this.title(entity.label());
            this.active(function (path) {
                return path.indexOf('/' + entity.name() + '/') === 0;
            });
            this.link('/' + entity.name() + '/list');
            // deprecated
            this.icon(entity.menuView().icon());
            return this;
        }
    }]);

    return Menu;
})();

exports['default'] = Menu;
module.exports = exports['default'];
//# sourceMappingURL=Menu.js.map