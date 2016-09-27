#!/bin/bash

scp flail:/var/www/api.titledb.com/db/titledb.db ./db/legacydb.sqlite

rm ./db/titledb.sqlite

initialize_titledb_db development.ini 

sqlite3 ./db/legacydb.sqlite .dump |\
    grep 'INSERT INTO "cias" ' |\
    sed "s/\"cias\"/\"cia\"/;s/VALUES([0-9]\+,/(active, titleid, publisher, name_l, name_s, url, created_at, updated_at, icon_s, icon_l, size, mtime) VALUES(1,/g; s/,\([0-9]\+\));$/,datetime(\1, 'unixepoch', 'localtime'));/g" |\
    sqlite3 ./db/titledb.sqlite

update_titledb_db development.ini 

#rm ./db/legacydb.sqlite

