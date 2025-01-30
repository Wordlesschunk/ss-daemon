const WebSocket = require("ws");
const { spawn } = require("child_process");

const PORT = 8080; // Change if needed
const CONTAINER_NAME = "your-container-name"; // Replace with your actual Docker container name

const wss = new WebSocket.Server({ port: PORT });

console.log(`WebSocket server running on ws://localhost:${PORT}`);

wss.on("connection", (ws) => {
    console.log("Client connected");

    // Start streaming logs from the Docker container
    const logStream = spawn("docker", ["logs", "-f", "--tail", "10", CONTAINER_NAME]);

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

