import { Router } from "express";
import { KafkaController } from "../controllers/KafkaController";
import { KafkaValidators } from "../validators/KafkaValidators";
import { validateRequest } from "../validators/ValidateRequest";

export class KafkaRouter {
    public router: Router;
    constructor() {
        this.router = Router();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.putRoutes();
        this.deleteRoutes();
    }

    getRoutes() {
        this.router.get(
            "/messages",
            KafkaValidators.validateMessages(),
            validateRequest,
            KafkaController.getMessagesByTopic
        )
    }
    postRoutes() {
        this.router.post(
            "/send",
            KafkaValidators.validatePublish(),
            validateRequest,
            KafkaController.publishInTopic
        )
    }
    patchRoutes() { }
    putRoutes() { }
    deleteRoutes() { }
}
