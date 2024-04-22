#!/bin/sh

# run the migrations
pnpm run:migration

# start the server
pnpm start:prod