#!/bin/sh

GOOFY=1

# install node v18
if command -v node; then
  echo 'node installed, checking if v18...'
  node --version | grep 'v18' || exit
else
  echo 'installing node'
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs
fi

# install postgres if not installed
if command -v psql; then
  echo 'postgresql installed'
else
  echo 'installing postgresql'
  sudo apt install postgresql postgresql-contrib
  sudo systemctl start postgresql.service
fi

# create a postgres superuser
# TODO: this might not be a superuser
sudo -u postgres createuser --superuser $USER

# create database
createdb onlybruinsdb

# create all tables
psql onlybruinsdb -f setup.sql

# add initial data
if [ "$GOOFY" -eq 1 ]; then
  psql onlybruinsdb -f initdata.sql
fi
