const http = require('http');
const WebSocket = require('ws');

const UUID = process.env.UUID || 'f2e17b4d-22fd-44a4-90db-40649717be8e';
const WS_PATH = process.env.WS_PATH || '/';

console.log('VLESS Server UUID:', UUID);
console.log('WS Path:', WS_PATH);

const server = http.createServer((req, res) => {
  res.end('VLESS OK');
});

const wss = new WebSocket.Server({ server, path: WS_PATH });

wss.on('connection', (ws) => {
  console.log('VLESS client connected');
  ws.on('message', (data) => {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN && client !== ws) {
        client.send(data);
      }
    });
  });
});

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`VLESS running on port ${port}`);
});
