#!/bin/bash
REPOSITORY=/home/ubuntu/diary-server

cd $REPOSITORY

npx prisma generate

pm2 save --force

pm2 start ecosystem.config.js

echo "success!!"
