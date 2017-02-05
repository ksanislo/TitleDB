'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _DataStore = require('admin-config/lib/DataStore/DataStore');

var _DataStore2 = _interopRequireDefault(_DataStore);

var _Entry = require('admin-config/lib/Entry');

var _Entry2 = _interopRequireDefault(_Entry);

var _batchDelete = require('./delete/batchDelete.html');

var _batchDelete2 = _interopRequireDefault(_batchDelete);

var _delete = require('./delete/delete.html');

var _delete2 = _interopRequireDefault(_delete);

var _create = require('./form/create.html');

var _create2 = _interopRequireDefault(_create);

var _edit = require('./form/edit.html');

var _edit2 = _interopRequireDefault(_edit);

var _list = require('./list/list.html');

var _list2 = _interopRequireDefault(_list);

var _listLayout = require('./list/listLayout.html');

var _listLayout2 = _interopRequireDefault(_listLayout);

var _show = require('./show/show.html');

var _show2 = _interopRequireDefault(_show);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function templateProvider(viewName, defaultView) {
    return ['$stateParams', 'NgAdminConfiguration', function ($stateParams, Configuration) {
        var customTemplate;
        var view = Configuration().getViewByEntityAndType($stateParams.entity, viewName);
        customTemplate = view.template();
        if (customTemplate) {
            return customTemplate;
        }
        customTemplate = Configuration().customTemplate()(viewName);
        if (customTemplate) {
            return customTemplate;
        }
        return defaultView;
    }];
}

function viewProvider(viewName) {
    return ['$stateParams', 'NgAdminConfiguration', function ($stateParams, Configuration) {
        var view;
        try {
            view = Configuration().getViewByEntityAndType($stateParams.entity, viewName);
        } catch (e) {
            var error404 = new Error('Unknown view or entity name');
            error404.status = 404; // trigger the 404 error
            throw error404;
        }
        if (!view.enabled) {
            throw new Error('The ' + viewName + ' is disabled for this entity');
        }
        return view;
    }];
}

function routing($stateProvider) {

    $stateProvider.state('listLayout', {
        abstract: true,
        url: '/:entity/list',
        params: {
            entity: null
        },
        parent: 'ng-admin',
        controller: 'ListLayoutController',
        controllerAs: 'llCtrl',
        templateProvider: templateProvider('ListView', _listLayout2.default),
        resolve: {
            dataStore: function dataStore() {
                return new _DataStore2.default();
            },
            view: viewProvider('ListView'),
            filterData: ['ReadQueries', 'view', function (ReadQueries, view) {
                return ReadQueries.getAllReferencedData(view.getFilterReferences(false));
            }],
            filterEntries: ['dataStore', 'view', 'filterData', function (dataStore, view, filterData) {
                var filters = view.getFilterReferences(false);
                for (var name in filterData) {
                    _Entry2.default.createArrayFromRest(filterData[name], [filters[name].targetField()], filters[name].targetEntity().name(), filters[name].targetEntity().identifier().name()).map(function (entry) {
                        return dataStore.addEntry(filters[name].targetEntity().uniqueId + '_choices', entry);
                    });
                }
            }]
        }
    }).state('list', {
        url: '?{search:json}&{page:int}&sortField&sortDir',
        params: {
            page: { value: 1, squash: true },
            search: { value: {}, squash: true },
            sortField: null,
            sortDir: null
        },
        parent: 'listLayout',
        views: {
            grid: {
                controller: 'ListController',
                controllerAs: 'listController',
                template: _list2.default,
                resolve: {
                    dataStore: function dataStore() {
                        return new _DataStore2.default();
                    },
                    view: viewProvider('ListView'),
                    response: ['$stateParams', 'ReadQueries', 'view', function ($stateParams, ReadQueries, view) {
                        var page = $stateParams.page,
                            filters = $stateParams.search,
                            sortField = $stateParams.sortField,
                            sortDir = $stateParams.sortDir;

                        return ReadQueries.getAll(view, page, filters, sortField, sortDir);
                    }],
                    totalItems: ['response', function (response) {
                        return response.totalItems;
                    }],
                    referenceData: ['ReadQueries', 'view', 'response', function (ReadQueries, view, response) {
                        return ReadQueries.getReferenceData(view.fields(), response.data);
                    }],
                    referenceEntries: ['dataStore', 'view', 'referenceData', function (dataStore, view, referenceData) {
                        var references = view.getReferences();
                        for (var name in referenceData) {
                            _Entry2.default.createArrayFromRest(referenceData[name], [references[name].targetField()], references[name].targetEntity().name(), references[name].targetEntity().identifier().name()).map(function (entry) {
                                return dataStore.addEntry(references[name].targetEntity().uniqueId + '_values', entry);
                            });
                        }
                    }],
                    entries: ['dataStore', 'view', 'response', 'referenceEntries', function (dataStore, view, response, referenceEntries) {
                        var entries = view.mapEntries(response.data);

                        // shortcut to diplay collection of entry with included referenced values
                        dataStore.fillReferencesValuesFromCollection(entries, view.getReferences(), true);

                        // set entries here ???
                        dataStore.setEntries(view.getEntity().uniqueId, entries);

                        return entries;
                    }],
                    prepare: ['view', '$stateParams', 'dataStore', 'entries', '$window', '$injector', function (view, $stateParams, dataStore, entries, $window, $injector) {
                        return view.prepare() && $injector.invoke(view.prepare(), view, {
                            query: $stateParams,
                            datastore: dataStore,
                            view: view,
                            Entry: _Entry2.default,
                            entries: entries,
                            window: $window
                        });
                    }]
                }
            }
        }
    });

    $stateProvider.state('show', {
        parent: 'ng-admin',
        url: '/:entity/show/:id?sortField&sortDir',
        controller: 'ShowController',
        controllerAs: 'showController',
        templateProvider: templateProvider('ShowView', _show2.default),
        params: {
            entity: null,
            id: null,
            page: { value: 1, squash: true },
            search: { value: {}, squash: true },
            sortField: null,
            sortDir: null
        },
        resolve: {
            dataStore: function dataStore() {
                return new _DataStore2.default();
            },
            view: viewProvider('ShowView'),
            rawEntry: ['$stateParams', 'ReadQueries', 'view', function ($stateParams, ReadQueries, view) {
                return ReadQueries.getOne(view.getEntity(), view.type, $stateParams.id, view.identifier(), view.getUrl());
            }],
            entry: ['view', 'rawEntry', function (view, rawEntry) {
                return view.mapEntry(rawEntry);
            }],
            referenceData: ['ReadQueries', 'view', 'entry', function (ReadQueries, view, entry) {
                return ReadQueries.getReferenceData(view.fields(), [entry.values]);
            }],
            referenceEntries: ['dataStore', 'view', 'referenceData', function (dataStore, view, referenceData) {
                var references = view.getReferences();
                for (var name in referenceData) {
                    _Entry2.default.createArrayFromRest(referenceData[name], [references[name].targetField()], references[name].targetEntity().name(), references[name].targetEntity().identifier().name()).map(function (entry) {
                        return dataStore.addEntry(references[name].targetEntity().uniqueId + '_values', entry);
                    });
                }
            }],
            referencedListData: ['$stateParams', 'ReadQueries', 'view', 'entry', function ($stateParams, ReadQueries, view, entry) {
                return ReadQueries.getReferencedListData(view.getReferencedLists(), $stateParams.sortField, $stateParams.sortDir, entry.identifierValue);
            }],
            referencedListEntries: ['dataStore', 'view', 'referencedListData', function (dataStore, view, referencedListData) {
                var referencedLists = view.getReferencedLists();
                for (var name in referencedLists) {
                    _Entry2.default.createArrayFromRest(referencedListData[name], referencedLists[name].targetFields(), referencedLists[name].targetEntity().name(), referencedLists[name].targetEntity().identifier().name()).map(function (entry) {
                        return dataStore.addEntry(referencedLists[name].targetEntity().uniqueId + '_list', entry);
                    });
                }
            }],
            entryWithReferences: ['dataStore', 'view', 'entry', 'referenceEntries', function (dataStore, view, entry, referenceEntries) {
                dataStore.fillReferencesValuesFromEntry(entry, view.getReferences(), true);
                dataStore.addEntry(view.getEntity().uniqueId, entry);
            }],
            referenceDataForReferencedLists: ['$q', 'ReadQueries', 'view', 'referencedListData', function ($q, ReadQueries, view, referencedListData) {
                var referencedLists = view.getReferencedLists();
                var promises = {};
                Object.keys(referencedLists).map(function (name) {
                    promises[name] = ReadQueries.getReferenceData(referencedLists[name].targetFields(), referencedListData[name]);
                });
                return $q.all(promises);
            }],
            referenceEntriesForReferencedLists: ['dataStore', 'view', 'referenceDataForReferencedLists', function (dataStore, view, referenceDataForReferencedLists) {
                var referencedLists = view.getReferencedLists();
                Object.keys(referencedLists).map(function (referencedListName) {
                    var references = referencedLists[referencedListName].getReferences();
                    for (var name in references) {
                        if (!referenceDataForReferencedLists[referencedListName][name]) {
                            continue;
                        }
                        _Entry2.default.createArrayFromRest(referenceDataForReferencedLists[referencedListName][name], [references[name].targetField()], references[name].targetEntity().name(), references[name].targetEntity().identifier().name()).map(function (entry) {
                            return dataStore.addEntry(references[name].targetEntity().uniqueId + '_values', entry);
                        });
                    }
                });
                return true;
            }],
            prepare: ['view', '$stateParams', 'dataStore', 'entry', 'entryWithReferences', 'referencedListEntries', 'referenceEntriesForReferencedLists', '$window', '$injector', function (view, $stateParams, dataStore, entry, entryWithReferences, referencedListEntries, referenceEntriesForReferencedLists, $window, $injector) {
                return view.prepare() && $injector.invoke(view.prepare(), view, {
                    query: $stateParams,
                    datastore: dataStore,
                    view: view,
                    Entry: _Entry2.default,
                    entry: entry,
                    window: $window
                });
            }]
        }
    });

    $stateProvider.state('create', {
        parent: 'ng-admin',
        url: '/:entity/create?{defaultValues:json}',
        controller: 'FormController',
        controllerAs: 'formController',
        templateProvider: templateProvider('CreateView', _create2.default),
        params: {
            page: { value: 1, squash: true },
            search: { value: {}, squash: true },
            defaultValues: { value: {}, squash: true },
            sortField: null,
            sortDir: null
        },
        resolve: {
            dataStore: function dataStore() {
                return new _DataStore2.default();
            },
            previousState: ['$state', '$stateParams', function ($state, $stateParams) {
                return {
                    name: $state.current.name || 'edit',
                    params: Object.keys($state.params).length > 0 ? $state.params : $stateParams
                };
            }],
            view: viewProvider('CreateView'),
            entry: ['$stateParams', 'dataStore', 'view', function ($stateParams, dataStore, view) {
                var entry = _Entry2.default.createForFields(view.getFields(), view.entity.name());
                Object.keys($stateParams.defaultValues).forEach(function (key) {
                    return entry.values[key] = $stateParams.defaultValues[key];
                });
                dataStore.addEntry(view.getEntity().uniqueId, entry);

                return entry;
            }],
            choiceData: ['ReadQueries', 'view', function (ReadQueries, view) {
                return ReadQueries.getAllReferencedData(view.getReferences(false));
            }],
            choiceEntries: ['dataStore', 'view', 'choiceData', function (dataStore, view, filterData) {
                var choices = view.getReferences(false);
                for (var name in filterData) {
                    _Entry2.default.createArrayFromRest(filterData[name], [choices[name].targetField()], choices[name].targetEntity().name(), choices[name].targetEntity().identifier().name()).map(function (entry) {
                        return dataStore.addEntry(choices[name].targetEntity().uniqueId + '_choices', entry);
                    });
                }
            }],
            prepare: ['view', '$stateParams', 'dataStore', 'entry', 'choiceEntries', '$window', '$injector', function (view, $stateParams, dataStore, entry, choiceEntries, $window, $injector) {
                return view.prepare() && $injector.invoke(view.prepare(), view, {
                    query: $stateParams,
                    datastore: dataStore,
                    view: view,
                    Entry: _Entry2.default,
                    entry: entry,
                    window: $window
                });
            }]
        }
    });

    $stateProvider.state('edit', {
        parent: 'ng-admin',
        url: '/:entity/edit/:id?sortField&sortDir',
        controller: 'FormController',
        controllerAs: 'formController',
        templateProvider: templateProvider('EditView', _edit2.default),
        params: {
            entity: null,
            id: null,
            page: { value: 1, squash: true },
            search: { value: {}, squash: true },
            sortField: null,
            sortDir: null
        },
        resolve: {
            dataStore: function dataStore() {
                return new _DataStore2.default();
            },
            previousState: ['$state', '$stateParams', function ($state, $stateParams) {
                return {
                    name: $state.current.name || 'edit',
                    params: Object.keys($state.params).length > 0 ? $state.params : $stateParams
                };
            }],
            view: viewProvider('EditView'),
            rawEntry: ['$stateParams', 'ReadQueries', 'view', function ($stateParams, ReadQueries, view) {
                return ReadQueries.getOne(view.getEntity(), view.type, $stateParams.id, view.identifier(), view.getUrl($stateParams.id));
            }],
            entry: ['view', 'rawEntry', function (view, rawEntry) {
                return view.mapEntry(rawEntry);
            }],
            referenceData: ['ReadQueries', 'view', 'entry', function (ReadQueries, view, entry) {
                return ReadQueries.getReferenceData(view.fields(), [entry.values]);
            }],
            referenceEntries: ['dataStore', 'view', 'referenceData', function (dataStore, view, referenceData) {
                var references = view.getReferences();
                for (var name in referenceData) {
                    _Entry2.default.createArrayFromRest(referenceData[name], [references[name].targetField()], references[name].targetEntity().name(), references[name].targetEntity().identifier().name()).map(function (entry) {
                        return dataStore.addEntry(references[name].targetEntity().uniqueId + '_values', entry);
                    });
                }
            }],
            referencedListData: ['$stateParams', 'ReadQueries', 'view', 'entry', function ($stateParams, ReadQueries, view, entry) {
                return ReadQueries.getReferencedListData(view.getReferencedLists(), $stateParams.sortField, $stateParams.sortDir, entry.identifierValue);
            }],
            referencedListEntries: ['dataStore', 'view', 'referencedListData', function (dataStore, view, referencedListData) {
                var referencedLists = view.getReferencedLists();
                for (var name in referencedLists) {
                    _Entry2.default.createArrayFromRest(referencedListData[name], referencedLists[name].targetFields(), referencedLists[name].targetEntity().name(), referencedLists[name].targetEntity().identifier().name()).map(function (entry) {
                        return dataStore.addEntry(referencedLists[name].targetEntity().uniqueId + '_list', entry);
                    });
                }
            }],
            entryWithReferences: ['dataStore', 'view', 'entry', 'referenceEntries', function (dataStore, view, entry, referenceEntries) {
                dataStore.fillReferencesValuesFromEntry(entry, view.getReferences(), true);
                dataStore.addEntry(view.getEntity().uniqueId, entry);
            }],
            choiceData: ['ReadQueries', 'view', function (ReadQueries, view) {
                return ReadQueries.getAllReferencedData(view.getReferences(false));
            }],
            choiceEntries: ['dataStore', 'view', 'choiceData', function (dataStore, view, filterData) {
                var choices = view.getReferences(false);
                for (var name in filterData) {
                    _Entry2.default.createArrayFromRest(filterData[name], [choices[name].targetField()], choices[name].targetEntity().name(), choices[name].targetEntity().identifier().name()).map(function (entry) {
                        return dataStore.addEntry(choices[name].targetEntity().uniqueId + '_choices', entry);
                    });
                }
            }],
            referenceDataForReferencedLists: ['$q', 'ReadQueries', 'view', 'referencedListData', function ($q, ReadQueries, view, referencedListData) {
                var referencedLists = view.getReferencedLists();
                var promises = {};
                Object.keys(referencedLists).map(function (name) {
                    promises[name] = ReadQueries.getReferenceData(referencedLists[name].targetFields(), referencedListData[name]);
                });
                return $q.all(promises);
            }],
            referenceEntriesForReferencedLists: ['dataStore', 'view', 'referenceDataForReferencedLists', function (dataStore, view, referenceDataForReferencedLists) {
                var referencedLists = view.getReferencedLists();
                Object.keys(referencedLists).map(function (referencedListName) {
                    var references = referencedLists[referencedListName].getReferences();
                    for (var name in references) {
                        if (!referenceDataForReferencedLists[referencedListName][name]) {
                            continue;
                        }
                        _Entry2.default.createArrayFromRest(referenceDataForReferencedLists[referencedListName][name], [references[name].targetField()], references[name].targetEntity().name(), references[name].targetEntity().identifier().name()).map(function (entry) {
                            return dataStore.addEntry(references[name].targetEntity().uniqueId + '_values', entry);
                        });
                    }
                });
                return true;
            }],
            prepare: ['view', '$stateParams', 'dataStore', 'entry', 'referenceEntriesForReferencedLists', 'choiceEntries', 'entryWithReferences', '$window', '$injector', function (view, $stateParams, dataStore, entry, referenceEntriesForReferencedLists, choiceEntries, entryWithReferences, $window, $injector) {
                return view.prepare() && $injector.invoke(view.prepare(), view, {
                    query: $stateParams,
                    datastore: dataStore,
                    view: view,
                    Entry: _Entry2.default,
                    entry: entry,
                    window: $window
                });
            }]
        }
    });

    $stateProvider.state('delete', {
        parent: 'ng-admin',
        url: '/:entity/delete/:id',
        controller: 'DeleteController',
        controllerAs: 'deleteController',
        templateProvider: templateProvider('DeleteView', _delete2.default),
        params: {
            page: { value: 1, squash: true },
            search: { value: {}, squash: true },
            sortField: null,
            sortDir: null
        },
        resolve: {
            dataStore: function dataStore() {
                return new _DataStore2.default();
            },
            view: viewProvider('DeleteView'),
            params: ['$stateParams', function ($stateParams) {
                return $stateParams;
            }],
            rawEntry: ['$stateParams', 'ReadQueries', 'view', function ($stateParams, ReadQueries, view) {
                return ReadQueries.getOne(view.getEntity(), view.type, $stateParams.id, view.identifier(), view.getUrl());
            }],
            entry: ['view', 'rawEntry', function (view, rawEntry) {
                return view.mapEntry(rawEntry);
            }],
            prepare: ['view', '$stateParams', 'dataStore', 'entry', '$window', '$injector', function (view, $stateParams, dataStore, entry, $window, $injector) {
                return view.prepare() && $injector.invoke(view.prepare(), view, {
                    query: $stateParams,
                    datastore: dataStore,
                    view: view,
                    Entry: _Entry2.default,
                    entry: entry,
                    window: $window
                });
            }]
        }
    });

    $stateProvider.state('batchDelete', {
        parent: 'ng-admin',
        url: '/:entity/batch-delete/{ids:json}',
        controller: 'BatchDeleteController',
        controllerAs: 'batchDeleteController',
        templateProvider: templateProvider('BatchDeleteView', _batchDelete2.default),
        params: {
            entity: null,
            ids: [],
            page: { value: 1, squash: true },
            search: { value: {}, squash: true },
            sortField: null,
            sortDir: null
        },
        resolve: {
            view: viewProvider('BatchDeleteView'),
            params: ['$stateParams', function ($stateParams) {
                return $stateParams;
            }]
        }
    });
}

routing.$inject = ['$stateProvider'];

exports.default = routing;
module.exports = exports['default'];
//# sourceMappingURL=routing.js.map