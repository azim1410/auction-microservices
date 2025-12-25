type ServiceInfo = { name: string; url: string };

const services: ServiceInfo[] = [
  { name: "user-service", url: process.env.USER_SERVICE_URL! },
  { name: "auction-service", url: process.env.AUCTION_SERVICE_URL! },
  { name: "bidding-service", url: process.env.BIDDING_SERVICE_URL! },
];

export const serviceUrl = (name: string): string | undefined => {
  return services.find((s) => s.name == name)?.url;
};
