#!/bin/bash
REPOSITORY=/home/ubuntu/diary-server

cd $REPOSITORY || exit

npm run prisma:generate

npm run build

pm2 restart app

echo "success!!"
