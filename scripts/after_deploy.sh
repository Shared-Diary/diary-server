#!/bin/bash
REPOSITORY=/home/ubuntu/diary-server

cd $REPOSITORY || exit

sudo npm run prisma:generate

sudo npm run pm2:start:prod

echo "success!!"
