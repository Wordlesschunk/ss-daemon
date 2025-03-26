

# SS-Daemon

Simple websocket server to send active docker container logs to a web service.

## Usage

Explain how to test the project and give some example.

```bash
node websocket-server.js <CONTAINER ID>
```
Run service in background
```bash
nohup node websocket-server.js <CONTAINER ID> > output.log 2>&1 &
```

sudo ufw allow 8080/tcp
//update firewall first

sudo certbot certonly --standalone -d localhost.srvshd.com

sudo apt update && sudo apt install -y certbot && sudo fuser -k 8080/tcp || true && sudo certbot certonly --standalone -d localhost.srvshd.com --non-interactive --agree-tos --email servershards@servershards.com

sudo certbot revoke --cert-path /etc/letsencrypt/live/yourdomain/fullchain.pem

sudo rm -rf /etc/letsencrypt/live/yourdomain
sudo rm -rf /etc/letsencrypt/archive/yourdomain
sudo rm -rf /etc/letsencrypt/renewal/yourdomain.conf

sudo apt remove --purge certbot

wss://localhost.srvshd.com:8080
