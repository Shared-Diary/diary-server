#!/bin/bash
REPOSITORY=/home/ubuntu
cd $REPOSITORY || exit

rm -rf diary-server

pm2 delete all
