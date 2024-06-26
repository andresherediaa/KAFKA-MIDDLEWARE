import { body, query } from 'express-validator';

export class KafkaValidators {
    static validateMessages() {
        return [
            query("topic")
                .not()
                .isEmpty()
                .withMessage(
                    "Especifique el topico a buscar"
                ),
        ];
    }
    
    static validatePublish() {
        return [
            body("topic")
                .notEmpty()
                .isString()
                .withMessage("Invalid topic in request"),
            body("message")
                .custom(value => {
                    // Verificar si es un string o un objeto JSON
                    if (typeof value !== 'string' && typeof value !== 'object') {
                        throw new Error('Invalid message in request, must be a string or an object');
                    }
                    return true;
                })
                .withMessage("Invalid message in request"),
        ];
    }
}
