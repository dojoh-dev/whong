#!/bin/sh

node dist/main.js &
cloudflared tunnel run --no-autoupdate --token "$CLOUDFLARED_TOKEN"
wait
