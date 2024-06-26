import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cors from "cors";
import { KafkaRouter } from "./routes/KafkaRouter";
import { NotFoundError, errorHandler } from "./validators/ValidateRequest";
import http from "http";
import { Server } from "socket.io";
import kafka from "kafka-node";
import dotenv from 'dotenv';
dotenv.config();

export class App {
  public app: express.Application;
  public kafkaRouter: KafkaRouter;
  private server: http.Server;
  private io: Server;
  private consumer!: kafka.Consumer;

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = new Server(this.server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    this.kafkaRouter = new KafkaRouter();
    this.setMiddlewares();
    this.setRoutes();
    this.setupSocketIO(); // Moved to allow dynamic topics subscription
    this.handle404Errors();
  }

  setMiddlewares() {
    this.app.use(cors());
    this.app.use(json());
  }

  setRoutes() {
    this.app.use("/api/v1", this.kafkaRouter.router);
    this.app.all("*", async (req, res) => {
      throw new NotFoundError();
    });
  }

  handle404Errors() {
    this.app.use(errorHandler);
  }

  setupKafkaConsumer(topics: string[]) {
    try {
      const client = new kafka.KafkaClient({ kafkaHost: process.env.KAFKA_HOST });
      const topicObjects = topics.map(topic => ({ topic, partition: 0 }));

      this.consumer = new kafka.Consumer(
        client,
        topicObjects,
        { autoCommit: true }
      );

      this.consumer.on('message', (message) => {
        this.io.emit('message', { topic: message.topic, value: message.value });
      });

      this.consumer.on('error', (err) => {
        console.error('Error in Kafka Consumer:', err);
      });
    } catch (error) {
      throw error;
    }
  }

  setupSocketIO() {
    this.io.on('connection', (socket) => {
      console.log('A user connected');

      socket.on('subscribe', (topic) => {
        console.log('Subscribed to topic:', topic);
        this.consumer.addTopics([{ topic: topic, partition: 0 }], (err, added) => {
          if (err) {
            console.error('Error adding topic:', err);
          } else {
            console.log('Topic added:', added);
          }
        });
      });

      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
    });
  }

  listen(port: number) {
    this.server.listen(port, () => {
      console.log(`Express server running on port ${port}`);
    });
  }
}
