const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3001 });
let clients = [];

wss.on('connection', function connection(ws) {
    clients.push(ws);
    console.log("Client connected. Total:", clients.length);

    ws.on('message', function incoming(message) {
        // Broadcast message to the other peer
        clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        clients = clients.filter(client => client !== ws);
        console.log("Client disconnected. Total:", clients.length);
    });
});

console.log("WebSocket server running on ws://localhost:3001");