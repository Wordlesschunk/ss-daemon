
find stuck processes
`sudo lsof -i :8080`

start server in background
`nohup node websocket-server.js > output.log 2>&1 &`