#!/bin/bash
REPOSITORY=/home/ubuntu/diary-server

cd $REPOSITORY

npm run prisma:generate

npm run pm2:start:prod

mkdir testFolder

echo "success!!"
