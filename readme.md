

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