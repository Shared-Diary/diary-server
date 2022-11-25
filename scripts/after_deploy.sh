#!/bin/bash
REPOSITORY=/home/ec2-user/diary-server

cd $REPOSITORY

npm run prisma:generate

pm2 restart app

echo "success!!"
