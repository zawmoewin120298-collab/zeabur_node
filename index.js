const http = require('http');
const WebSocket = require('ws');
const crypto = require('crypto');
const url = require('url');

const UUID = process.env.UUID || 'f2e17b4d-22fd-44a4-90db-40649717be8e';
const WS_PATH = process.env.WS_PATH || '/';

console.log('VLESS Server starting... UUID:', UUID);
console.log('WebSocket Path:', WS_PATH);

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/plain',
  });
  res.end('VLESS WebSocket Server');
});

const wss = new WebSocket.Server({ 
  server,
  path: WS_PATH 
});

wss.on('connection', (ws, req) => {
  const clientIP = req.socket.remoteAddress;
  console.log(`New VLESS connection from ${clientIP}`);
  
  ws.on('message', (data) => {
    console.log('VLESS data received:', data.length, 'bytes');
    // Forward VLESS protocol data
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
  
  ws.on('close', () => {
    console.log('VLESS connection closed:', clientIP);
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`VLESS Server running on port ${PORT}`);
});
