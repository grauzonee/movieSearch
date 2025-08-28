#!/bin/sh
if [ "$NODE_ENV" = "dev" ]; then
  npm run dev
else
  npm run compile
fi

