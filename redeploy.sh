#!/bin/bash

git checkout -f main
git pull
PORT=3011 docker compose -f docker-compose.prod.yml down
./build.sh
./serve.sh
