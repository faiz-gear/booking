#!/bin/sh

# run the migrations
pnpm run:migration:prod

# start the server
pnpm start:prod