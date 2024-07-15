#!/bin/bash

docker cp "data.csv" mysql:/tmp/data.csv
docker cp "schema.sql" mysql:/tmp/schema.sql
docker cp "restore.sql" mysql:/tmp/restore.sql

cat <<EOF | docker exec --interactive mysql sh
mysql -u "admin" "-padmin" "kach" < /tmp/schema.sql
mysql -u "admin" "-padmin" "kach" < /tmp/restore.sql
EOF