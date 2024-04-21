#!/bin/bash

# Check if a migration name is provided
if [ -z "$1" ]
then
  echo "Error: No migration name provided."
  echo "Usage: ./generate_migration.sh <MigrationName>"
  exit 1
fi

# Assign the migration name from the first argument
MIGRATION_NAME=$1

# Navigate to your project directory if the script is not placed there
# cd /path/to/your/project

# Run the migration generate command with the custom migration name
npx typeorm-ts-node-commonjs migration:generate -d ./src/data-source.ts  ./src/migrations/$MIGRATION_NAME