'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = maDashboardPanel;
function maDashboardPanel($state) {
    return {
        restrict: 'E',
        scope: {
            collection: '&',
            entries: '&',
            datastore: '&'
        },
        link: function link(scope) {
            scope.gotoList = function () {
                $state.go($state.get('list'), { entity: scope.collection().entity.name() });
            };
        },
        template: '<div class="panel-heading">\n    <a ng-click="gotoList()">{{ (collection().title() || collection().entity.label()) | translate }}</a>\n</div>\n<ma-datagrid name="{{ collection().name() }}"\n    entries="entries()"\n    fields="::collection().fields()"\n    entity="::collection().entity"\n    list-actions="::collection().listActions()"\n    datastore="datastore()">\n</ma-datagrid>'
    };
}

maDashboardPanel.$inject = ['$state'];
module.exports = exports['default'];
//# sourceMappingURL=maDashboardPanel.js.map