import Consul from "consul";

const consul = new Consul({
  host: process.env.CONSUL_HOST || "127.0.0.1",
  port: Number(process.env.CONSUL_PORT),
});

export const getServiceUrl = async (
  serviceName: string
): Promise<string | null> => {
  try {
    const nodes = await consul.catalog.service.nodes(serviceName);
    if (!nodes.length) return null;
    const node = nodes[Math.floor(Math.random() * nodes.length)];
    return `http://${node.ServiceAddress || node.Address}:${node.ServicePort}`;
  } catch (err) {
    return null;
  }
};
