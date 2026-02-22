#!/bin/bash
set -e

# Standard postgres entrypoint
exec docker-entrypoint.sh "$@"
