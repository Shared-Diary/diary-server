#!/bin/bash
REPOSITORY=/home/ec2-user/build

cd $REPOSITORY

sudo npm install

sudo npm run prisma:generate

sudo npm run build

sudo npm run start:prod

echo "success!!"