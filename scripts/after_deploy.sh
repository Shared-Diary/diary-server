#!/bin/bash
REPOSITORY=/home/ec2-user/diary-server

cd $REPOSITORY

sudo npm run prisma:generate

sudo npm run pm2:restart

echo "success!!"

# npm 등 명령이 제대로 수행되고 있지 않는 것은 sudo 명령 문제를 해결하면 될 수도 있겠다