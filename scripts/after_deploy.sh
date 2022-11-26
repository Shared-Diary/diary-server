#!/bin/bash
REPOSITORY=/home/ec2-user/diary-server

cd $REPOSITORY

sudo npm run prisma:generate

sudo npm run pm2:start:prod

echo "success!!"