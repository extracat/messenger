#Restore at heroku
heroku pg:backups:restore 'https://extracat.herokuapp.com/db.dump' DATABASE_URL -a extracat-messenger-api

#Dump for heroku
/Applications/Postgres.app/Contents/Versions/10/bin/pg_dump -Fc --no-acl --no-owner messenger > db.dump

#Dump SQL
/Applications/Postgres.app/Contents/Versions/10/bin/pg_dump messenger > db.sql

#Restore 
/Applications/Postgres.app/Contents/Versions/10/bin/psql messenger < db.sql
