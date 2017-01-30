# TitleDB.com

TitleDB.com API rewritten as a proper Python WSGI application. 


*API Base URL*: https://3ds.titledb.com/v1/  

The API is a RESTful interface which provides a listing service of 3DS homebrew in a variety of formats avaliable around the internet. 
Sets of data are interconnected by foreign keys following a naming pattern of *_id, which correspond to the id in the matching table. 
Specifc items can be located by id number directly, as /{type}/{id}

File collections:  
/cia  
/tdsx  
/smdh  
/xml  
/arm9  

Object collections:  
/entry  
/category  
/assets  
/url  
/submission  

For cia and smdh, you can generate an icon of the specified format. You can specify png, gif, jpg, bmp, or bin (3DS GPU native):  
/{type}/{id}/{field}.{format} (eg. /cia/44/icon_l.png or /smdh/7/icon_s.bin)  

Any file items can be downloaded directly via TitleDB's proxy decompression as:  
/{type}/{id}/download  
This will provide the listed file itself. This is best to use for making into QR codes, as FBI can use this to install a .cia directly.

# Adding new homebrew
The only globally allowed PUT is on /submission, if you send a JSON body of {"url":"https://path.to/some/homebrew.zip"} the new entry will be created, and you can follow the processing via the returned submission id.  


# Filtering views
You can change the results of collections with some basic filtering parameters (e.g. /cia?_page=2&_perPage=20 )  
_page: Which page view you would like, instead of everything.  

_perPage: When used with a _page, for how many results per page are displayed.

_sortField: Which field to sort the results by

_sortDir: ASC or DESC, which direction should the sort apply.

_filters: A URL encoded JSON string, consisting of a set of key value pairs, where the key is the column name, and the value is to be matched. Optionally, if the value is an array [] they will be matched as an OR condition. And if the value is another key:value pair, the key is used as the condition type of:
* eq: equals  
* ne: not equals  
* lt: less than  
* le: less than or equal  
* gt: greater than  
* ge: greater than or equal  
* re: SQL style regexp  
* like: SQL style % as wildcard  

# Nested view and filtering result values
Nesting is selectable on/off for both collections and record, just by adding a url parameter of nested=true or nested=false to the URL. The current defaults are a good starting option though, as apps and interfaces will generally want to just pull down everything as collections, which gives the un-nested view. Enabling nested makes thing more clear when looking at entries manually.

You can also filter results with any number of exclude=${field} or only=${field} to control the display of information. If you require filtering for a sub-level of a nested hierarchy, you will need to specify it in dot-notation based on the type. Be aware, if you adjust filtering, it will override some of the nested filter defaults, and you may need to exclude additional data that you don't need. Please check your URLs manually to ensure they work as you have expected. Some not particularly useful examples would be:  
https://api.titledb.com/v1/url?only=id&only=url  
or  
https://api.titledb.com/v1/entry?nested=true&exclude=cia.icon_l&exclude=cia.icon_s&exclude=tdsx.smdh.icon_l&exclude=tdsx.smdh.icon_s&_page=8&_perPage=5


# Other assorted things
Authentication is currently managed with basic web pages on /login and /logout, and current status can be checked via /login_status, I've not settled on how this should be implemented quite yet, so things will change around a bit here.

There's also a /time object which will return the current time in ISO8601 format, so 3DS apps can have a reliable network time source.

