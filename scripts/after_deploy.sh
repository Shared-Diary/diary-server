#!/bin/bash
REPOSITORY=/home/ec2-user/diary-server

cd $REPOSITORY

npm install -g pm2

npm run prisma:generate

npm run pm2:start:prod

echo "success!!"