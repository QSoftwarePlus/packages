#!/bin/bash

docker cp "data.csv" mysql:/tmp/data.csv
docker cp "restore.sql" mysql:/tmp/restore.sql

cat <<EOF | docker exec --interactive mysql sh
mysql -u "admin" "-padmin" "kach" < /tmp/restore.sql
EOF

echo "Done"