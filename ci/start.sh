#!/bin/sh

node dist/index.js &
cloudflared tunnel --no-autoupdate run --token "$CLOUDFLARED_TOKEN" --url http://localhost:3000
wait
