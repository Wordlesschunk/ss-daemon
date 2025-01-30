const WebSocket = require("ws");
const { spawn } = require("child_process");

const PORT = 8080; // Change if needed
const CONTAINER_ID = process.argv[2]; // Get container ID from the command line argument

if (!CONTAINER_ID) {
    console.error("Error: No container ID provided.");
    process.exit(1); // Exit if no container ID is provided
}

const wss = new WebSocket.Server({ port: PORT });

console.log(`WebSocket server running on ws://localhost:${PORT}`);
console.log(`Streaming logs for container: ${CONTAINER_ID}`);

wss.on("connection", (ws) => {
    console.log("Client connected");

    // Start streaming logs from the Docker container
    const logStream = spawn("docker", ["logs", "-f", "--tail", "10", CONTAINER_ID]);

    logStream.stdout.on("data", (data) => {
        ws.send(data.toString());
    });

    logStream.stderr.on("data", (data) => {
        ws.send(data.toString());
    });

    ws.on("close", () => {
        console.log("Client disconnected");
        logStream.kill(); // Stop the log stream when the client disconnects
    });
});
