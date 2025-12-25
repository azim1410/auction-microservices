import { connectRabbitMQ } from "./rabbitmq";

export const waitForEvent = async (
  exchange: string,
  matchFn: (msg: any) => boolean,
  timeout = 10000,
  queueName: string,
  consumerTag?: string // add this parameter
): Promise<any | null> => {
  const ch = await connectRabbitMQ();
  await ch.assertExchange(exchange, 'fanout', { durable: false });
  const q = await ch.assertQueue(queueName, { exclusive: false });
  await ch.bindQueue(q.queue, exchange, '');
  const tag = consumerTag || `consumerTag-${Math.random().toString(36).substring(2, 10)}`;
  console.log(`[Orchestrator] Waiting for event on exchange "${exchange}", queue "${q.queue}", consumerTag "${tag}"`);
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      ch.cancel(tag);
      resolve(null); // Timeout
    }, timeout);

    ch.consume(
      q.queue,
      (msg: any) => {
        if (msg) {
          const data = JSON.parse(msg.content.toString());
          console.log('[Orchestrator] Received event:', data);
          if (matchFn(data)) {
            clearTimeout(timer);
            ch.ack(msg);
            resolve(data);
          } else {
            ch.nack(msg, false, true); // Requeue if not matching
          }
        }
      },
      { consumerTag: tag, noAck: false }
    );
  });
};