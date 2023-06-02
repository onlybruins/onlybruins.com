# OnlyBruins 🐻
Bringing audiences to Bruin creators through unique user experiences.

## Setup

#### Clone this repository

```bash
git clone https://github.com/onlybruins/onlybruins.com
cd onlybruins.com
```
#### [Install Node.js LTS](https://nodejs.org/en/download)

On Ubuntu this looks like

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```
## Running Locally
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
## Running in Production
Ports below 1024 are privileged, but we need port 80 to serve HTTP. You need this one-time setup to let Node use privileged ports:
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
