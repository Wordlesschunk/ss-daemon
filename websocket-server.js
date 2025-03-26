const WebSocket = require("ws");
const { spawn } = require("child_process");
const https = require("https");
const fs = require("fs");

const PORT = 8080;
const CONTAINER_ID = process.argv[2];

if (!CONTAINER_ID) {
    console.error("Error: No container ID provided.");
    process.exit(1);
}

// SSL certificate and private key paths
const certPath = '/etc/letsencrypt/live/localhost.srvshd.com/fullchain.pem';
const keyPath = '/etc/letsencrypt/live/localhost.srvshd.com/privkey.pem';

const serverOptions = {
    cert: fs.readFileSync(certPath),
    key: fs.readFileSync(keyPath),
};

const server = https.createServer(serverOptions);

// Create WebSocket server using the HTTPS server
const wss = new WebSocket.Server({ server });

console.log(`WebSocket server running at wss://localhost:${PORT}`);
console.log(`Streaming logs for container: ${CONTAINER_ID}`);

wss.on("connection", (ws) => {
    console.log("Client connected");

    const logStream = spawn("docker", ["logs", "-f", "--tail", "100", CONTAINER_ID]);

    logStream.stdout.on("data", (data) => {
        ws.send(data.toString());
    });

    logStream.stderr.on("data", (data) => {
        ws.send(data.toString());
    });

    ws.on("close", () => {
        console.log("Client disconnected");
        logStream.kill();
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Secure WebSocket server listening on wss://localhost:${PORT}`);
});
