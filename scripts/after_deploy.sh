#!/bin/bash
REPOSITORY=/home/ec2-user/diary-server

cd $REPOSITORY

sudo npm run prisma:generate

pm2 reload $REPOSITORY/ecosystem.config.js

echo "success!!"