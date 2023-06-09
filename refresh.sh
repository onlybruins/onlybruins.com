#!/bin/sh

git pull --ff-only
killall node
npm install
npm run build
psql onlybruinsdb -f setup.sql -f initdata.sql

echo 'run: '
echo '  NODE_ENV=production nohup node backend >onlybruins.log 2>&1 <&- &'
