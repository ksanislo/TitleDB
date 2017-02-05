'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _layout = require('../view/layout.html');

var _layout2 = _interopRequireDefault(_layout);

var _dashboard = require('../view/dashboard.html');

var _dashboard2 = _interopRequireDefault(_dashboard);

var _ = require('../view/404.html');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function dataStoreProvider() {
    return ['AdminDescription', function (AdminDescription) {
        return AdminDescription.getDataStore();
    }];
}

function entryConstructorProvider() {
    return ['AdminDescription', function (AdminDescription) {
        return AdminDescription.getEntryConstructor();
    }];
}

function routing($stateProvider, $urlRouterProvider) {

    $stateProvider.state('ng-admin', {
        abstract: true,
        views: {
            'ng-admin': {
                controller: 'AppController',
                controllerAs: 'appController',
                templateProvider: ['NgAdminConfiguration', function (Configuration) {
                    return Configuration().layout() || _layout2.default;
                }]
            }
        }
    });

    $stateProvider.state('dashboard', {
        parent: 'ng-admin',
        url: '/dashboard?sortField&sortDir',
        params: {
            sortField: null,
            sortDir: null
        },
        controller: 'DashboardController',
        controllerAs: 'dashboardController',
        templateProvider: ['NgAdminConfiguration', function (Configuration) {
            return Configuration().dashboard().template() || _dashboard2.default;
        }],
        resolve: {
            dataStore: dataStoreProvider(),
            Entry: entryConstructorProvider(),
            hasEntities: ['NgAdminConfiguration', function (Configuration) {
                return Configuration().entities.length > 0;
            }],
            collections: ['NgAdminConfiguration', function (Configuration) {
                return Configuration().dashboard().collections();
            }],
            responses: ['$stateParams', '$q', 'collections', 'dataStore', 'Entry', 'ReadQueries', function ($stateParams, $q, collections, dataStore, Entry, ReadQueries) {
                var sortField = 'sortField' in $stateParams ? $stateParams.sortField : null;
                var sortDir = 'sortDir' in $stateParams ? $stateParams.sortDir : null;

                var promises = {},
                    collection,
                    collectionSortField,
                    collectionSortDir,
                    collectionName;

                for (collectionName in collections) {
                    collection = collections[collectionName];
                    collectionSortField = collection.getSortFieldName();
                    collectionSortDir = collection.sortDir();
                    if (sortField && sortField.split('.')[0] === collection.name()) {
                        collectionSortField = sortField;
                        collectionSortDir = sortDir;
                    }
                    promises[collectionName] = function (collection, collectionSortField, collectionSortDir) {
                        var rawEntries;

                        return ReadQueries.getAll(collection, 1, {}, collectionSortField, collectionSortDir).then(function (response) {
                            rawEntries = response.data;
                            return rawEntries;
                        }).then(function (rawEntries) {
                            return ReadQueries.getReferenceData(collection.fields(), rawEntries);
                        }).then(function (referenceData) {
                            var references = collection.getReferences();
                            for (var name in referenceData) {
                                Entry.createArrayFromRest(referenceData[name], [references[name].targetField()], references[name].targetEntity().name(), references[name].targetEntity().identifier().name()).map(function (entry) {
                                    return dataStore.addEntry(references[name].targetEntity().uniqueId + '_values', entry);
                                });
                            }
                        }).then(function () {
                            var entries = collection.mapEntries(rawEntries);

                            // shortcut to display collection of entry with included referenced values
                            dataStore.fillReferencesValuesFromCollection(entries, collection.getReferences(), true);

                            return entries;
                        });
                    }(collection, collectionSortField, collectionSortDir);
                }

                return $q.all(promises);
            }],
            entries: ['responses', 'collections', function (responses, collections) {
                var collectionName,
                    entries = {};

                for (collectionName in responses) {
                    entries[collections[collectionName].name()] = responses[collectionName];
                }

                return entries;
            }]
        }
    });

    $stateProvider.state('ma-404', {
        parent: 'ng-admin',
        template: _2.default
    });

    $urlRouterProvider.when('', '/dashboard');

    $urlRouterProvider.otherwise(function ($injector, $location) {
        var state = $injector.get('$state');
        state.go('ma-404');
        return $location.path();
    });
}

routing.$inject = ['$stateProvider', '$urlRouterProvider'];

exports.default = routing;
module.exports = exports['default'];
//# sourceMappingURL=routing.js.map