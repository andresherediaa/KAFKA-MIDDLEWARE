import { NextFunction, Request, Response } from "express";
import { KafkaClient, Producer, Consumer, Message } from "kafka-node";
import util from "util";

export class KafkaController {
    private static consumer: Consumer | null = null;
    private static messages: Message[] = [];
    private static client: KafkaClient = new KafkaClient();
    private static producer: Producer = new Producer(KafkaController.client);
    private static MAX_MESSAGES = 10;

    private static async closeConsumer(): Promise<void> {
        if (KafkaController.consumer) {
            return new Promise<void>((resolve, reject) => {
                KafkaController.consumer?.close(true, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    KafkaController.consumer = null;
                    console.log("Consumer closed.");
                    resolve();
                });
            });
        }
    }

    private static async initConsumer(topicName: string): Promise<void> {
        const client = new KafkaClient();
        try {
            // Cargar metadatos del topic
            const loadMetadata = util
                .promisify(client.loadMetadataForTopics)
                .bind(client);
            const results = await loadMetadata([topicName]);

            const partitions = results[1].metadata[topicName];
            const topics = [];
            for (const partition in partitions) {
                if (partitions.hasOwnProperty(partition)) {
                    topics.push({
                        topic: topicName,
                        partition: parseInt(partition),
                        offset: 0,
                    });
                }
            }

            KafkaController.consumer = new Consumer(client, topics, {
                fromOffset: true,
                autoCommit: false,
            });

            // Manejar mensajes
            KafkaController.consumer.on("message", async (message) => {
                KafkaController.messages.push(message);
                while (KafkaController.messages.length > KafkaController.MAX_MESSAGES) {
                    KafkaController.messages.shift(); // Eliminar el mensaje más antiguo (el primero en el array)
                }
            });

            // Manejar errores
            KafkaController.consumer.on("error", (err) => {
                console.error(`Error in Kafka Consumer for topic ${topicName}:`, err);
            });

            // Manejar offsets fuera de rango
            KafkaController.consumer.on("offsetOutOfRange", (topic) => {
                console.error(`Offset out of range for topic ${topicName}:`, topic);
            });
        } catch (error) {
            throw error;
        }
    }

    public static async getMessagesByTopic(req: Request, res: Response, next: NextFunction): Promise<void> {
        const topicName = (req.query.topic as string); // Obtener el nombre del tópico de la query de la URL, o utilizar 'noticias' por defecto
        try {
            console.log(topicName);
            await KafkaController.initConsumer(topicName); // Re-inicializar el consumidor

            while (KafkaController.messages.length === 0) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            // Filtrar y enviar los mensajes del tema solicitado
            const filteredMessages = KafkaController.messages.filter(
                (message) => message.topic === topicName
            );
            res.send(filteredMessages);
            KafkaController.messages = [];

            // Cerrar el consumidor después de enviar la respuesta
            await KafkaController.closeConsumer();
        } catch (error) {
            next(error);
        }
    }

    public static async publishInTopic(req: Request, res: Response, next: NextFunction) {
        try {
            const { topic, message } = req.body;
            KafkaController.sendMessage(topic, message);
            res.status(200).send("Message sent to Kafka");
        } catch (error) {
            next(error)
        }
    }

    private static async sendMessage(topic: string, message: string) {
        try {
            const payloads = [{ topic: topic, messages: JSON.stringify(message) }];
            KafkaController.producer.on("ready", () => {
                console.log("Kafka Producer is ready");
            });

            KafkaController.producer.on("error", (err) => {
                console.error("Error in Kafka Producer:", err);
            });

            KafkaController.producer.send(payloads, (err, data) => {
                if (err) {
                    console.error("Error sending message:", err);
                } else {
                    console.log("Message sent:", data);
                }
            });
        } catch (error) {
            throw error;
        }

    }
}

