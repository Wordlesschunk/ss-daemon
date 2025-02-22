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

// Read SSL certificate and key
const options = {
    cert: fs.readFileSync("server.crt"),  // Your SSL certificate
    key: fs.readFileSync("server.key")    // Your SSL private key
};

// Create HTTPS server with SSL configuration
const server = https.createServer(options);

// Create WebSocket server on top of the HTTPS server with CORS check
const wss = new WebSocket.Server({
    server,
    verifyClient: (info, cb) => {
        const allowedOrigin = 'https://servershards.com'; // Replace with your web server's origin
        if (info.origin === allowedOrigin) {
            cb(true);
        } else {
            cb(false, 403, 'Forbidden'); // Reject if origin is not allowed
        }
    }
});

console.log(`WebSocket server running on wss://localhost:${PORT}`);
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
    console.log(`Server listening on https://localhost:${PORT}`);
});
