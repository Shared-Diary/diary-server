#!/bin/bash
REPOSITORY=/home/ubuntu
cd $REPOSITORY

sudo pm2 kill

rm -rf diary-server
