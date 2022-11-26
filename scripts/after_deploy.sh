#!/bin/bash
REPOSITORY=/home/ec2-user/diary-server

cd $REPOSITORY

sudo npm install -g pm2

sudo npm run prisma:generate

sudo pm2 start ecosystem.config.js

echo "success!!"