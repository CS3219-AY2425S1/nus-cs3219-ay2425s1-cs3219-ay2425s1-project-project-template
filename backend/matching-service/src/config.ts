import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  kafkaBrokerId: process.env.KAFKA_BROKER_ID,
}));
