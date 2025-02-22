const WebSocket = require("ws");
const https = require("https");
const fs = require("fs");
const { spawn } = require("child_process");

const PORT = 8080;
const CONTAINER_ID = process.argv[2];

if (!CONTAINER_ID) {
    console.error("Error: No container ID provided.");
    process.exit(1);
}

// Using self-signed certificate
const certOptions = {
    key: fs.readFileSync("private.key"),
    cert: fs.readFileSync("certificate.crt"),
};

// Create HTTPS server
const server = https.createServer(certOptions);

const wss = new WebSocket.Server({ server });

console.log(`WebSocket server running on wss://YOUR_IP:${PORT}`);
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

// Start the HTTPS server
server.listen(PORT, () => {
    console.log(`Secure WebSocket server is running on wss://YOUR_IP:${PORT}`);
});
