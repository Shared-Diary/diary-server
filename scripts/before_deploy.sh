#!/bin/bash
REPOSITORY=/home/ec2-user

cd $REPOSITORY || exit

sudo pm2 delete all

sudo rm -rf diary-server
