#!/bin/bash
REPOSITORY=/home/ubuntu/diary-server

cd $REPOSITORY

npm run prisma:generate

pm2 save --force

npm run pm2:start:prod

echo "success!!"
