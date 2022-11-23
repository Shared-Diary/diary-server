#!/bin/bash
REPOSITORY=/home/ubuntu/diary-server

cd $REPOSITORY || exit

npm run prisma:generate

npm run pm2:start:prod

echo "success!!"
