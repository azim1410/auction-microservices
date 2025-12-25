import amqp from 'amqplib';

let channel: amqp.Channel | null = null;

export const connectRabbitMQ = async () => {
  if (channel) return channel;
  const connection = await amqp.connect('amqp://localhost');
  channel = await connection.createChannel();
  return channel;
};

/**
 * Publish an event to a fanout exchange.
 * @param exchange - The exchange name (e.g., 'auction.ended')
 * @param message - The message object to send
 */
export const publishEvent = async (exchange: string, message: object) => {
  const ch = await connectRabbitMQ();
  await ch.assertExchange(exchange, 'fanout', { durable: false });
  ch.publish(exchange, '', Buffer.from(JSON.stringify(message)));
  console.log(`[RabbitMQ] Published to exchange "${exchange}":`, message);
};

/**
 * Subscribe to a fanout exchange with a unique queue.
 * @param exchange - The exchange name (e.g., 'auction.ended')
 * @param handler - Function to handle received messages
 * @param queueName - Unique queue name for this service (e.g., 'orchestrator-auction-ended')
 */
export const consumeEvent = async (
  exchange: string,
  handler: (msg: any) => void,
  queueName: string
) => {
  const ch = await connectRabbitMQ();
  await ch.assertExchange(exchange, 'fanout', { durable: false });
  const q = await ch.assertQueue(queueName, { exclusive: false });
  await ch.bindQueue(q.queue, exchange, '');
  console.log(`[RabbitMQ] Subscribed to exchange "${exchange}", queue "${q.queue}"`);
  ch.consume(q.queue, (msg) => {
    if (msg) {
      try {
        handler(JSON.parse(msg.content.toString()));
      } catch (err) {
        console.error('[RabbitMQ] Error parsing message:', err);
      }
      ch.ack(msg);
    }
  });
};