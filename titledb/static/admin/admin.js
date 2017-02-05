var myApp = angular.module('myApp', ['ng-admin']);
myApp.config(['NgAdminConfigurationProvider', function (nga) {
    // create an admin application
    var admin = nga.application('TitleDB')
      .baseApiUrl('https://3ds.titledb.com/v1/'); // production API endpoint
      //.baseApiUrl('http://192.168.42.20:6543/v1/'); // development API endpoint
    // create a user entity
    // the API endpoint for this entity will be 'http://dev.titledb.com/v1/entry/:id
    var entry = nga.entity('entry');
    // set the fields of the user entity list view
    entry.listView().fields([
        nga.field('id'),
        nga.field('name'),
        nga.field('author'),
        nga.field('headline'),
        nga.field('url'),
     ]).sortDir('ASC').sortField('name');

     entry.showView().fields([
        nga.field('id'),
        nga.field('active', 'boolean'),
        nga.field('name'),
        nga.field('author'),
        nga.field('headline'),
        nga.field('description', 'text'),
        nga.field('url'),
        nga.field('category_id', 'reference')
            .targetEntity(nga.entity('category'))
            .targetField(nga.field('name'))
            .label('Category'),
        nga.field('created_at'),
        nga.field('updated_at'),
        nga.field('cia', 'referenced_list')
            .targetEntity(nga.entity('cia'))
            .targetReferenceField('entry_id')
            .targetFields([
                nga.field('id'),
                nga.field('name_s'),
                nga.field('titleid'),
                nga.field('version')
            ]),
         nga.field('tdsx', 'referenced_list')
            .targetEntity(nga.entity('tdsx'))
            .targetReferenceField('entry_id')
            .targetFields([
                nga.field('id'),
                nga.field('path'),
                nga.field('version')
            ]),
         nga.field('arm9', 'referenced_list')
            .targetEntity(nga.entity('arm9'))
            .targetReferenceField('entry_id')
            .targetFields([
                nga.field('id'),
                nga.field('path'),
                nga.field('version')
            ])
    ]);

     entry.editionView().fields([
        nga.field('id').editable(false),
        nga.field('active' ,'boolean')
            .validation({ required: true }),
        nga.field('name')
            .validation({ required: true }),
        nga.field('author')
            .validation({ required: true }),
        nga.field('headline')
            .validation({ required: true }),
        nga.field('description', 'text')
            .validation({ required: true }),
        nga.field('url')
            .validation({ required: true }),
        nga.field('category_id', 'reference')
            .validation({ required: true })
            .targetEntity(nga.entity('category'))
            .targetField(nga.field('name'))
            .label('Category')
            .remoteComplete(false)
            .sortField('name')
            .perPage(5000),
        nga.field('created_at').editable(false),
        nga.field('updated_at').editable(false),
        nga.field('cia', 'referenced_list')
            .targetEntity(nga.entity('cia'))
            .targetReferenceField('entry_id')
            .targetFields([
                nga.field('id'),
                nga.field('name_s'),
                nga.field('titleid'),
                nga.field('version')
            ]),
         nga.field('tdsx', 'referenced_list')
            .targetEntity(nga.entity('tdsx'))
            .targetReferenceField('entry_id')
            .targetFields([
                nga.field('id'),
                nga.field('path'),
                nga.field('version')
            ]),
         nga.field('arm9', 'referenced_list')
            .targetEntity(nga.entity('arm9'))
            .targetReferenceField('entry_id')
            .targetFields([
                nga.field('id'),
                nga.field('path'),
                nga.field('version')
            ])
    ]);

     entry.creationView().fields([
        nga.field('active' ,'boolean')
            .validation({ required: true })
            .defaultValue(true),
        nga.field('name')
            .validation({ required: true }),
        nga.field('author')
            .validation({ required: true }),
        nga.field('headline')
            .validation({ required: true }),
        nga.field('description', 'text')
            .validation({ required: true }),
        nga.field('url')
            .validation({ required: true }),
        nga.field('category_id', 'reference')
            .validation({ required: true })
            .targetEntity(nga.entity('category'))
            .targetField(nga.field('name'))
            .label('Category')
            .remoteComplete(false)
            .sortField('name')
            .perPage(5000)
    ]);
     // add the user entity to the admin application
    admin.addEntity(entry);

    var cia = nga.entity('cia');
    // set the fields of the user entity list view
    cia.listView().fields([
        nga.field('id'),
        nga.field('entry_id', 'reference')
            .targetEntity(nga.entity('entry'))
            .targetField(nga.field('name'))
            .label('Entry'),
        nga.field('name_s'),
        nga.field('publisher'),
        nga.field('titleid'),
        nga.field('version')
    ]).sortDir('ASC').sortField('name_s'); 

    cia.showView().fields([
        nga.field('id'),
        nga.field('active', 'boolean'),
        nga.field('version'),
        nga.field('size'),
        nga.field('mtime'),
        nga.field('path'),
        nga.field('sha256'),
        nga.field('url_id', 'reference')
            .targetEntity(nga.entity('url'))
            .targetField(nga.field('url'))
            .label('URL'),
        nga.field('entry_id', 'reference')
            .targetEntity(nga.entity('entry'))
            .targetField(nga.field('name'))
            .label('Entry'),
        nga.field('assets_id', 'reference')
            .targetEntity(nga.entity('assets'))
            .targetField(nga.field('id'))
            .label('Assets'),
        nga.field('titleid'),
        nga.field('name_s'),
        nga.field('name_l'),
        nga.field('publisher'),
        nga.field('created_at'),
        nga.field('updated_at')
     ]);

     cia.editionView().fields([
        nga.field('id').editable(false),
        nga.field('active', 'boolean')
            .validation({ required: true }),
        nga.field('version'),
        nga.field('size').editable(false),
        nga.field('mtime').editable(false),
        nga.field('path').editable(false),
        nga.field('sha256').editable(false),
        nga.field('url_id', 'reference')
            .targetEntity(nga.entity('url'))
            .targetField(nga.field('url'))
            .label('URL')
            .editable(false),
        nga.field('entry_id', 'reference')
            .targetEntity(nga.entity('entry'))
            .targetField(nga.field('name'))
            .label('Entry')
            .remoteComplete(false)
            .sortField('name')
            .perPage(5000),
        nga.field('assets_id', 'reference')
            .targetEntity(nga.entity('assets'))
            .targetField(nga.field('id'))
            .label('Assets')
            .remoteComplete(false)
            .sortField('id')
            .perPage(5000),
        nga.field('titleid').editable(false),
        nga.field('name_s').editable(false),
        nga.field('name_l').editable(false),
        nga.field('publisher').editable(false),
        nga.field('created_at').editable(false),
        nga.field('updated_at').editable(false)
     ]);
    // add the user entity to the admin application
    admin.addEntity(cia);

    var tdsx = nga.entity('tdsx');
    // set the fields of the user entity list view
    tdsx.listView().fields([
        nga.field('id'),
        nga.field('entry_id', 'reference')
            .targetEntity(nga.entity('entry'))
            .targetField(nga.field('name'))
            .label('Entry'),
        nga.field('path'),
        nga.field('version')
    ]).sortDir('ASC').sortField('path'); 

    tdsx.showView().fields([
        nga.field('id'),
        nga.field('active'),
        nga.field('version'),
        nga.field('size'),
        nga.field('mtime'),
        nga.field('path'),
        nga.field('sha256'),
        nga.field('url_id', 'reference')
            .targetEntity(nga.entity('url'))
            .targetField(nga.field('url'))
            .label('URL'),
        nga.field('entry_id', 'reference')
            .targetEntity(nga.entity('entry'))
            .targetField(nga.field('name'))
            .label('Entry'),
        nga.field('smdh_id', 'reference')
            .targetEntity(nga.entity('smdh'))
            .targetField(nga.field('path'))
            .label('SMDH'),
        nga.field('xml_id', 'reference')
            .targetEntity(nga.entity('xml'))
            .targetField(nga.field('path'))
            .label('XML'),
        nga.field('assets_id', 'reference')
            .targetEntity(nga.entity('assets'))
            .targetField(nga.field('id'))
            .label('Assets'),
        nga.field('created_at'),
        nga.field('updated_at')
     ]);

     tdsx.editionView().fields([
        nga.field('id').editable(false),
        nga.field('active', 'boolean')
            .validation({ required: true }),
        nga.field('version'),
        nga.field('size').editable(false),
        nga.field('mtime').editable(false),
        nga.field('path').editable(false),
        nga.field('sha256').editable(false),
        nga.field('url_id', 'reference')
            .targetEntity(nga.entity('url'))
            .targetField(nga.field('url'))
            .label('URL')
            .editable(false),
        nga.field('entry_id', 'reference')
            .targetEntity(nga.entity('entry'))
            .targetField(nga.field('name'))
            .label('Entry')
            .remoteComplete(false)
            .sortField('name')
            .perPage(5000),
        nga.field('smdh_id', 'reference')
            .targetEntity(nga.entity('smdh'))
            .targetField(nga.field('path'))
            .label('SMDH')
            .remoteComplete(false)
            .sortField('path')
            .perPage(5000),
        nga.field('xml_id', 'reference')
            .targetEntity(nga.entity('xml'))
            .targetField(nga.field('path'))
            .label('XML')
            .remoteComplete(false)
            .sortField('path')
            .perPage(5000),
        nga.field('assets_id', 'reference')
            .targetEntity(nga.entity('assets'))
            .targetField(nga.field('id'))
            .label('Assets')
            .remoteComplete(false)
            .sortField('id')
            .perPage(5000),
        nga.field('created_at').editable(false),
        nga.field('updated_at').editable(false)
     ]);
    // add the user entity to the admin application
    admin.addEntity(tdsx);

    var smdh = nga.entity('smdh');
    // set the fields of the user entity list view
    smdh.listView().fields([
        nga.field('id'),
        nga.field('name_s'),
        nga.field('url_id', 'reference')
            .targetEntity(nga.entity('url'))
            .targetField(nga.field('url'))
            .label('URL'),
        nga.field('version')
    ]).sortDir('ASC').sortField('name_s'); 

    smdh.showView().fields([
        nga.field('id'),
        nga.field('active'),
        nga.field('version'),
        nga.field('size'),
        nga.field('mtime'),
        nga.field('path'),
        nga.field('sha256'),
        nga.field('url_id', 'reference')
            .targetEntity(nga.entity('url'))
            .targetField(nga.field('url'))
            .label('URL'),
        nga.field('name_s'),
        nga.field('name_l'),
        nga.field('publisher'),
        nga.field('created_at'),
        nga.field('updated_at'),
        nga.field('tdsx', 'referenced_list')
            .targetEntity(nga.entity('tdsx'))
            .targetReferenceField('smdh_id')
            .targetFields([
                nga.field('id'),
                nga.field('path'),
                nga.field('version')
            ])
    ]);

    smdh.editionView().fields([
        nga.field('id').editable(false),
        nga.field('active', 'boolean')
            .validation({ required: true }),
        nga.field('version'),
        nga.field('size').editable(false),
        nga.field('mtime').editable(false),
        nga.field('path').editable(false),
        nga.field('sha256').editable(false),
        nga.field('url_id', 'reference')
            .targetEntity(nga.entity('url'))
            .targetField(nga.field('url'))
            .label('URL')
            .editable(false),
        nga.field('name_s').editable(false),
        nga.field('name_l').editable(false),
        nga.field('publisher').editable(false),
        nga.field('created_at').editable(false),
        nga.field('updated_at').editable(false),
        nga.field('tdsx', 'referenced_list')
            .targetEntity(nga.entity('tdsx'))
            .targetReferenceField('smdh_id')
            .targetFields([
                nga.field('id'),
                nga.field('path'),
                nga.field('version')
            ])
    ]);
    // add the user entity to the admin application
    admin.addEntity(smdh);

    var xml = nga.entity('xml');
    // set the fields of the user entity list view
    xml.listView().fields([
        nga.field('id'),
        nga.field('path'),
        nga.field('url_id', 'reference')
            .targetEntity(nga.entity('url'))
            .targetField(nga.field('url'))
            .label('URL'),
        nga.field('version')
    ]).sortDir('ASC').sortField('path'); 

    xml.showView().fields([
        nga.field('id'),
        nga.field('active'),
        nga.field('version'),
        nga.field('size'),
        nga.field('mtime'),
        nga.field('path'),
        nga.field('sha256'),
        nga.field('url_id', 'reference')
            .targetEntity(nga.entity('url'))
            .targetField(nga.field('url'))
            .label('URL'),
        nga.field('created_at'),
        nga.field('updated_at'),
        nga.field('tdsx', 'referenced_list')
            .targetEntity(nga.entity('tdsx'))
            .targetReferenceField('xml_id')
            .targetFields([
                nga.field('id'),
                nga.field('path'),
                nga.field('version')
            ])
    ]);

    xml.editionView().fields([
        nga.field('id').editable(false),
        nga.field('active', 'boolean')
            .validation({ required: true }),
        nga.field('version'),
        nga.field('size').editable(false),
        nga.field('mtime').editable(false),
        nga.field('path').editable(false),
        nga.field('sha256').editable(false),
        nga.field('url_id', 'reference')
            .targetEntity(nga.entity('url'))
            .targetField(nga.field('url'))
            .label('URL')
            .editable(false),
        nga.field('created_at').editable(false),
        nga.field('updated_at').editable(false),
        nga.field('tdsx', 'referenced_list')
            .targetEntity(nga.entity('tdsx'))
            .targetReferenceField('xml_id')
            .targetFields([
                nga.field('id'),
                nga.field('path'),
                nga.field('version')
            ])
    ]);
    // add the user entity to the admin application
    admin.addEntity(xml);

    var arm9 = nga.entity('arm9');
    // set the fields of the user entity list view
    arm9.listView().fields([
        nga.field('id'),
        nga.field('entry_id', 'reference')
            .targetEntity(nga.entity('entry'))
            .targetField(nga.field('name'))
            .label('Entry'),
        nga.field('path'),
        nga.field('version')
    ]).sortDir('ASC').sortField('path'); 

    arm9.showView().fields([
        nga.field('id'),
        nga.field('active'),
        nga.field('version'),
        nga.field('size'),
        nga.field('mtime'),
        nga.field('path'),
        nga.field('sha256'),
        nga.field('url_id', 'reference')
            .targetEntity(nga.entity('url'))
            .targetField(nga.field('url'))
            .label('URL'),
        nga.field('entry_id', 'reference')
            .targetEntity(nga.entity('entry'))
            .targetField(nga.field('name'))
            .label('Entry'),
        nga.field('assets_id', 'reference')
            .targetEntity(nga.entity('assets'))
            .targetField(nga.field('id'))
            .label('Assets'),
        nga.field('created_at'),
        nga.field('updated_at')
     ]);

     arm9.editionView().fields([
        nga.field('id').editable(false),
        nga.field('active', 'boolean')
            .validation({ required: true }),
        nga.field('version'),
        nga.field('size').editable(false),
        nga.field('mtime').editable(false),
        nga.field('path').editable(false),
        nga.field('sha256').editable(false),
        nga.field('url_id', 'reference')
            .targetEntity(nga.entity('url'))
            .targetField(nga.field('url'))
            .label('URL')
            .editable(false),
        nga.field('entry_id', 'reference')
            .targetEntity(nga.entity('entry'))
            .targetField(nga.field('name'))
            .label('Entry')
            .remoteComplete(false)
            .sortField('name')
            .perPage(5000),
        nga.field('assets_id', 'reference')
            .targetEntity(nga.entity('assets'))
            .targetField(nga.field('id'))
            .label('Assets')
            .remoteComplete(false)
            .sortField('id')
            .perPage(5000),
        nga.field('created_at').editable(false),
        nga.field('updated_at').editable(false)
     ]);
    // add the user entity to the admin application
    admin.addEntity(arm9);

    var category = nga.entity('category');
    // set the fields of the user entity list view
    category.listView().fields([
        nga.field('id'),
        nga.field('name')
    ]).sortDir('ASC').sortField('name'); 

    category.showView().fields([
        nga.field('id'),
        nga.field('active'),
        nga.field('name'),
        nga.field('created_at'),
        nga.field('updated_at'),
        nga.field('entry', 'referenced_list')
            .targetEntity(nga.entity('entry'))
            .targetReferenceField('category_id')
            .targetFields([
                nga.field('id'),
                nga.field('name'),
                nga.field('author'),
                nga.field('headline')
            ])
     ]);

     category.editionView().fields([
        nga.field('id').editable(false),
        nga.field('active', 'boolean')
           .validation({ required: true }),
        nga.field('name')
           .validation({ required: true }),
        nga.field('created_at').editable(false),
        nga.field('updated_at').editable(false),
        nga.field('entry', 'referenced_list')
            .targetEntity(nga.entity('entry'))
            .targetReferenceField('category_id')
            .targetFields([
                nga.field('id'),
                nga.field('name'),
                nga.field('author'),
                nga.field('headline')
            ])
     ]);

     category.creationView().fields([
        nga.field('active', 'boolean')
            .validation({ required: true })
            .defaultValue(true),
        nga.field('name')
            .validation({ required: true })
     ]);
    // add the user entity to the admin application
    admin.addEntity(category);

    var status = nga.entity('status');
    // set the fields of the user entity list view
    status.listView().fields([
        nga.field('id'),
        nga.field('name')
    ]).sortDir('ASC').sortField('name'); 

    status.showView().fields([
        nga.field('id'),
        nga.field('active'),
        nga.field('name'),
        nga.field('created_at'),
        nga.field('updated_at'),
        nga.field('entry', 'referenced_list')
            .targetEntity(nga.entity('entry'))
            .targetReferenceField('status_id')
            .targetFields([
                nga.field('id'),
                nga.field('name'),
                nga.field('author'),
                nga.field('headline')
            ])
     ]);

     status.editionView().fields([
        nga.field('id').editable(false),
        nga.field('active', 'boolean')
           .validation({ required: true }),
        nga.field('name')
           .validation({ required: true }),
        nga.field('created_at').editable(false),
        nga.field('updated_at').editable(false),
        nga.field('entry', 'referenced_list')
            .targetEntity(nga.entity('entry'))
            .targetReferenceField('status_id')
            .targetFields([
                nga.field('id'),
                nga.field('name'),
                nga.field('author'),
                nga.field('headline')
            ])
     ]);

     status.creationView().fields([
        nga.field('active', 'boolean')
            .validation({ required: true })
            .defaultValue(true),
        nga.field('name')
            .validation({ required: true })
     ]);
    // add the user entity to the admin application
    admin.addEntity(status);

    var url = nga.entity('url');
    // set the fields of the user entity list view
    url.listView().fields([
        nga.field('id'),
        nga.field('url'),
        nga.field('content_type'),
        nga.field('filename'),
    ]).sortDir('ASC').sortField('url'); 

    url.showView().fields([
        nga.field('id'),
        nga.field('active'),
        nga.field('version'),
        nga.field('size'),
        nga.field('mtime'),
        nga.field('filename'),
        nga.field('sha256'),
        nga.field('url'),
        nga.field('content_type'),
        nga.field('etag'),
        nga.field('created_at'),
        nga.field('updated_at'),
        nga.field('cia', 'referenced_list')
            .targetEntity(nga.entity('cia'))
            .targetReferenceField('url_id')
            .targetFields([
                nga.field('id'),
                nga.field('name_s'),
                nga.field('titleid'),
                nga.field('version')
            ]),
         nga.field('tdsx', 'referenced_list')
            .targetEntity(nga.entity('tdsx'))
            .targetReferenceField('url_id')
            .targetFields([
                nga.field('id'),
                nga.field('path'),
                nga.field('version')
            ]),
         nga.field('smdh', 'referenced_list')
            .targetEntity(nga.entity('smdh'))
            .targetReferenceField('url_id')
            .targetFields([
                nga.field('id'),
                nga.field('path'),
                nga.field('version')
            ]),
         nga.field('xml', 'referenced_list')
            .targetEntity(nga.entity('xml'))
            .targetReferenceField('url_id')
            .targetFields([
                nga.field('id'),
                nga.field('path'),
                nga.field('version')
            ]),
         nga.field('arm9', 'referenced_list')
            .targetEntity(nga.entity('arm9'))
            .targetReferenceField('url_id')
            .targetFields([
                nga.field('id'),
                nga.field('path'),
                nga.field('version')
            ])
      ]);

     url.editionView().fields([
        nga.field('id').editable(false),
        nga.field('active', 'boolean')
           .validation({ required: true }),
        nga.field('version'),
        nga.field('size').editable(false),
        nga.field('mtime').editable(false),
        nga.field('filename').editable(false),
        nga.field('sha256').editable(false),
        nga.field('url').editable(false),
        nga.field('content_type').editable(false),
        nga.field('etag').editable(false),
        nga.field('created_at').editable(false),
        nga.field('updated_at').editable(false),
        nga.field('cia', 'referenced_list')
            .targetEntity(nga.entity('cia'))
            .targetReferenceField('url_id')
            .targetFields([
                nga.field('id'),
                nga.field('name_s'),
                nga.field('titleid'),
                nga.field('version')
            ]),
         nga.field('tdsx', 'referenced_list')
            .targetEntity(nga.entity('tdsx'))
            .targetReferenceField('url_id')
            .targetFields([
                nga.field('id'),
                nga.field('path'),
                nga.field('version')
            ]),
         nga.field('smdh', 'referenced_list')
            .targetEntity(nga.entity('smdh'))
            .targetReferenceField('url_id')
            .targetFields([
                nga.field('id'),
                nga.field('path'),
                nga.field('version')
            ]),
         nga.field('xml', 'referenced_list')
            .targetEntity(nga.entity('xml'))
            .targetReferenceField('url_id')
            .targetFields([
                nga.field('id'),
                nga.field('path'),
                nga.field('version')
            ]),
         nga.field('arm9', 'referenced_list')
            .targetEntity(nga.entity('arm9'))
            .targetReferenceField('url_id')
            .targetFields([
                nga.field('id'),
                nga.field('path'),
                nga.field('version')
            ])
      ]);
    // add the user entity to the admin application
    admin.addEntity(url);

    var assets = nga.entity('assets');
    // set the fields of the user entity list view
    assets.listView().fields([
        nga.field('id'),
        nga.field('url_id', 'reference')
            .targetEntity(nga.entity('url'))
            .targetField(nga.field('url'))
            .label('URL'),
        nga.field('version')
    ]).sortDir('ASC').sortField('id'); 

    assets.showView().fields([
        nga.field('id'),
        nga.field('active'),
        nga.field('version'),
        nga.field('size'),
        nga.field('mtime'),
        nga.field('path'),
        nga.field('sha256'),
        nga.field('url_id', 'reference')
            .targetEntity(nga.entity('url'))
            .targetField(nga.field('url'))
            .label('URL'),
        nga.field('created_at'),
        nga.field('updated_at')
     ]);
    // add the user entity to the admin application
    admin.addEntity(assets);


    var submission = nga.entity('submission');
    // set the fields of the user entity list view
    submission.listView().fields([
        nga.field('id'),
        nga.field('url'),
        nga.field('status'),
    ]).sortDir('ASC').sortField('id'); 

    submission.creationView().fields([
        nga.field('url')
    ]);

    submission.showView().fields([
        nga.field('id'),
        nga.field('active'),
        nga.field('url'),
        nga.field('status'),
        nga.field('created_at'),
        nga.field('updated_at')
     ]);
    // add the user entity to the admin application
    admin.addEntity(submission);

    // attach the admin application to the DOM and execute it
    nga.configure(admin);
}]);

myApp.config(['RestangularProvider', function (RestangularProvider) {
    RestangularProvider.addFullRequestInterceptor(function(element, operation, what, url, headers, params) {
        if (operation == "getList") {
            //delete params._page;
            //delete params._perPage;
            //delete params._sortField;
            //delete params._sortDir;
            params.nested = "false";
        }
        return { params: params };
    });
}]);
