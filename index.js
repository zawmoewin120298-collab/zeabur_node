const http = require('http');
const WebSocket = require('ws');

const UUID = process.env.UUID || 'f2e17b4d-22fd-44a4-90db-40649717be8e';
const WS_PATH = process.env.WS_PATH || '/';

console.log('=== VLESS Server Starting ===');
console.log('UUID:', UUID);
console.log('WS_PATH:', WS_PATH);

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('VLESS WebSocket Server OK');
});

const wss = new WebSocket.Server({ 
  server, 
  path: WS_PATH 
});

wss.on('connection', (ws, req) => {
  console.log('✅ VLESS client connected:', req.socket.remoteAddress);
  
  ws.on('message', data => {
    // Forward VLESS traffic
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN && client !== ws) {
        client.send(data);
      }
    });
  });
  
  ws.on('close', () => {
    console.log('❌ VLESS client disconnected');
  });
  
  ws.on('error', err => {
    console.log('⚠️ WS error:', err.message);
  });
});

// Zeabur PORT ONLY - ဒီ line က အရေးကြီး!
const port = process.env.PORT || 3000;
server.listen(port, '0.0.0.0', () => {
  console.log('🚀 VLESS Server running on port', port);
  console.log('================ READY ================');
});

server.on('error', (err) => {
  console.error('Server error:', err.message);
});
