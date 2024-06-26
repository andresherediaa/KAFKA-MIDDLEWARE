import { App } from "./app";

const app = new App();
const port: number = 3000;

const start = async () => {
  app.listen(port);

  // List of topics to subscribe
  const topics = ['noticias', 'deudas'];
  
  // Setup Kafka Consumer with dynamic topics
  app.setupKafkaConsumer(topics);
};

start();
