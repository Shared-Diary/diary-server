#!/bin/bash
REPOSITORY=/home/ec2-user/build

cd $REPOSITORY

sudo npm run prisma:generate

pm2 reload app

echo "success!!"