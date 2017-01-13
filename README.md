# TitleDB.com

TitleDB.com API rewritten as a proper Python WSGI application.

I'll try to get some proper docs written up on the new API, but here's the short version if you just want to play with it. Right now the overall idea is that there's a /v1/, which is the "nested" collection view of /v1/entry that doesn't show base64 encoded data (currently just icon data), all other collections are un-nested views. Calling / directly reports some information about the backend and available paths.

Normal object collections (mods can edit/add to as required):  
/v1/entry  
/v1/category  

File object collections (these will generally will be filled by the scan/import and should be mostly static except for 'active'):  
/v1/cia  
/v1/tdsx (starting with numbers will cause problems for developers)  
/v1/smdh  
/v1/xml  
/v1/arm9  

Special object collections (File object, but with editable "mapping" script that moderators will need to provide/edit):  
/v1/assets  

When a collection is called with a GET, the collection will return a list of all items where the 'active' field is set to True, as such you can make a new entry, just by POSTing the json { "active": True } to a collection URL, though it's more useful to post the full json object for what you wish to create at once. Some fields like 'id' can't be changed or specified, but you will get your new object with it defined in the result.

All objects have an 'id' field that will remain static for that object, so for example a new version of a .cia will have a new entry with a new id. Associations are made between various objects based on an *_id field (e.g. entry_id) referencing the id of the corresponding object.

Specific objects can be referenced with a GET on their individual id, such as /cia/44 or /entry/1, and can be edited by using a PUT with a json object containing the new information to be set, such as { "category_id": 2 }. At the moment, the single object GET will return a nested view, where all *_id values will be replaced with their corresponding object. And any objects matching foreign keys will be embedded. For example when listing an entry, the category_id record will be replaced by 'category' set to the name value, and additional object lists for cia, tdsx, and arm9 will show up with any objects which have a foreign key of 'entry_id' matching the 'id' on the record.

I haven't decided entirely how I'm going to handle icon generation or proxying, so that's all kind of up in the air right now as well. I'm leaning toward /cia/{id}/icon_l.{format} for providing the icon_l entry encoded into the specified format (e.g. /cia/44/icon_s.png or /smdh/7/icon_s.gif) then developers can choose their preferred icon format on their own. If you have any input on this, feel free to let me know.

Proxy extraction is also undecided, I'm thinking that i'll implement as /v1/{filetype}/{id}/download so it can be expanded to allow proxy extract for types other than cia. However, it's notably less useful for arm9's .bin and .3dsx files especially, with their separate .smdh and .xml that's usually archived along side the executable binary. Again, suggestions are welcome if you have any, just open an issue with your ideas.

Nesting is selectable on/off for both collections and record, just by adding a url parameter of nested=true or nested=false to the URL. The current defaults are a good starting option though, as apps and interfaces will generally want to just pull down everything as collections, which gives the un-nested view, and a pull on a single object will show all related information, avoiding the need for additional requests. It does make editing a bit strange however, as your GET returns a nested view, but you still have to PUT/POST with the *_id values.

You can also filter results with any number of exclude=${field} or only=${field} to control the display of information. If you require filtering for a sub-level of a nested hierarchy, you will need to specify it in dot-notation based on the type. Be aware, if you adjust filtering, it will override some of the nested filter defaults, and you may need to exclude additional data that you don't need. Please check your URLs manually to ensure they work as you have expected. Some not particularly useful examples would be:  
https://dev.titledb.com/v1/url?only=url  
or  
https://dev.titledb.com/v1/entry?nested=true&exclude=cia.icon_l&exclude=cia.icon_s&exclude=tdsx.smdh.icon_l&exclude=tdsx.smdh.icon_s  

DELETE is also supported, but only by admin accounts, since an object's id will be considered static, delisting will be done instead, by setting 'active' to False on the record by general moderators.

Authentication is currently managed with basic web pages on /v1/login and /v1/logout, and current status can be checked via /v1/login_status, I've not settled on how this should be implemented quite yet, so things will change around a bit here.

There's also a /v1/time object which will return the current time in ISO8601 format

