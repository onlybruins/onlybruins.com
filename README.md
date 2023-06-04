# OnlyBruins 🐻
Bringing audiences to Bruin creators through unique user experiences.

## Setup

#### Clone this repository

```bash
git clone https://github.com/onlybruins/onlybruins.com
cd onlybruins.com
```

#### [Install Node.js LTS](https://nodejs.org/en/download)
On Ubuntu,
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### [Set up PostgreSQL](https://www.postgresql.org/download/)
On Ubuntu,
```bash
sudo apt install postgresql postgresql-contrib
sudo -u postgres createuser --superuser $USER
createdb onlybruinsdb
```

## Prepare to run latest code
```bash
git pull # get the latest code on main
npm install
sudo systemctl restart postgresql.service # On WSL, sudo service postgresql restart
psql onlybruinsdb -f setup.sql # Update with latest schema. ⚠️THIS WILL DROP EXISTING DATA.
```

## Run Locally
During development, for frontend (not backend!) hot-reloading run
```bash
npm run --prefix backend build
npm run dev
```
Alternatively, to serve everything from the backend run
```bash
npm start
```
and navigate to http://localhost:8080.
## Run in Production
Ports below 1024 are privileged on Linux, but we need ports 80/443 to serve HTTP/HTTPS. Use this one-time setup to let Node use privileged ports:
```bash
sudo setcap 'cap_net_bind_service=+ep' `which node`
```
From the `onlybruins.com` directory, run
```bash
NODE_ENV=production npm start
```
If you use SSH and want to leave the server running after you disconnect, run
```bash
npm run build
NODE_ENV=production nohup node backend >onlybruins.log 2>&1 <&- &
```
Remember to kill this process if you want to run a more recent version of the server.
#### HTTPS
OnlyBruins will always serve HTTP. If it finds `privatekey.key` and `certificate.pem` in your $HOME, it will also serve HTTPS.
