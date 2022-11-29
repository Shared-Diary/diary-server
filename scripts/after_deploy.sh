#!/bin/bash
REPOSITORY=/home/ec2-user/diary-server

cd $REPOSITORY || exit

sudo npm run prisma:generate

sudo pm2 start ecosystem.config.js

echo "success!!"