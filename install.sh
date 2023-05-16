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
  echo 'postgres installed'
else
  echo 'installing postgres'
  sudo apt install postgres postgres-contrib
  sudo systemctl start postgresql.service
fi

# create a postgres superuser
# TODO: this might not be a superuser
sudo -u postgres createuser --superuser dev

# create database
createdb --username=dev onlybruinsdb

# create all tables
psql --username=dev onlybruinsdb -f setup.sql

# add initial data
if [ "$GOOFY" -eq 1 ]; then
  psql --username=dev onlybruinsdb -f initdata.sql
end
