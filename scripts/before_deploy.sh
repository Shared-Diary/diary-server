#!/bin/bash
REPOSITORY=/home/ec2-user
cd $REPOSITORY || exit

pm2 delete all

rm -rf diary-server
