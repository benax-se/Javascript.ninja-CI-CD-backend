#!/usr/bin/env bash
set -euo pipefail

export PGPASSWORD="$1"

psql -U deploy -d postgres -c "DROP DATABASE IF EXISTS \"$2\";"
