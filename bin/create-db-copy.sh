#!/usr/bin/env bash
set -euo pipefail

export PGPASSWORD="$1"

psql -U deploy -d postgres -c "DROP DATABASE IF EXISTS \"$2\";"
psql -U deploy -d postgres -c "CREATE DATABASE \"$2\";"
pg_dump -U deploy -d main | psql "$2"
psql -U deploy postgres -c "GRANT ALL PRIVILEGES ON DATABASE \"$2\" to realworld;";