const { PeerServer } = require('peer');

const peerServer = PeerServer({
  port: 9000, // Open this port in AWS Security Group
  path: '/calls',
  proxied: true
});

console.log("PeerJS server running on port 9000");
 