#!/bin/bash
REPOSITORY=/home/ubuntu
cd $REPOSITORY || exit

pm2 delete all
rm -rf diary-server
