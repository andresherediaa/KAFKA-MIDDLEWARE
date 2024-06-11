import { Router } from "express";
import { FoodController } from "../controllers/FoodController";
import { FoodValidators } from "../validators/FoodValidators";

export class FoodRouter {
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
            "/nearby",
            FoodValidators.nearby,
            FoodController.findNearbyTrucks
        );

        this.router.get(
            "/foodtrucks/search",
            FoodController.advancedSearch
        );
    }
    postRoutes() {

    }
    patchRoutes() { }
    putRoutes() { }
    deleteRoutes() { }
}
