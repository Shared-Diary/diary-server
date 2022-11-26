#!/bin/bash
REPOSITORY=/home/ec2-user/diary-server

cd $REPOSITORY

sudo npm install -g pm2

sudo npm run prisma:generate

sudo npm run pm2:restart

echo "success!!"