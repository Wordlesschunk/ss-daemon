const WebSocket = require("ws");
const { spawn } = require("child_process");

const PORT = 8080;
const CONTAINER_ID = process.argv[2];

if (!CONTAINER_ID) {
    console.error("Error: No container ID provided.");
    process.exit(1);
}

const wss = new WebSocket.Server({ port: PORT });

console.log(`WebSocket server running on ws://localhost:${PORT}`);
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
