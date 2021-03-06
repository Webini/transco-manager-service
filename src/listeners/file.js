const EXCHANGE_NAME = process.env.RABBITMQ_FILE_EXCHANGE;
const retry = require('servicebus-retry');
const manager = require('../service/manager.js');
const bus   = require('../bus.js').create({
  prefetch: 2
});

bus.use(bus.correlate());
bus.use(retry({
  store: new retry.RedisStore({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }),
  maxRetries: 1
}));

bus.subscribe('transco-manager-files', { 
  queueOptions: {
    autoDelete: false, 
    durable: true,
  },
  ack: true, 
  routingKey: 'file.downloaded',
  exchangeName: EXCHANGE_NAME,
  exchangeOptions: {
    durable: true,
    type: 'topic',
    autoDelete: false
  }
}, (event, data) => {
  if (manager.canProcess(data.name)) {
    //probe the movie
    //calculate presets
    //find transcoder
  }
  /**
  event.handle.ack();
  event.handle.reject();
  */
});