import express from 'express';

const app = express();
app.use(express.json());

type ServiceInfo = {
  address: string;
  port: number;
  lastSeen: number;
};

const services: Record<string, ServiceInfo> = {};

// Register a service
app.post('/register', (req, res) => {
  const { name, address, port } = req.body;
  services[name] = { address, port, lastSeen: Date.now() };
  console.log(`[Registry] Registered: ${name} at ${address}:${port}`);
  res.json({ status: 'registered' });
});

// Heartbeat to keep service alive
app.post('/heartbeat', (req, res) => {
  const { name } = req.body;
  if (services[name]) {
    services[name].lastSeen = Date.now();
    res.json({ status: 'heartbeat received' });
  } else {
    res.status(404).json({ error: 'Service not registered' });
  }
});

// Lookup a service
app.get('/services/:name', (req, res) => {
  const service = services[req.params.name];
  if (service && Date.now() - service.lastSeen < 30000) { // 30s timeout
    res.json(service);
  } else {
    res.status(404).json({ error: 'Service not available' });
  }
});

// Cleanup dead services every 30s
setInterval(() => {
  const now = Date.now();
  for (const [name, service] of Object.entries(services)) {
    if (now - service.lastSeen > 30000) {
      console.log(`[Registry] Removing stale service: ${name}`);
      delete services[name];
    }
  }
}, 30000);

app.listen(4000, () => console.log('Registry Service running on port 4000'));