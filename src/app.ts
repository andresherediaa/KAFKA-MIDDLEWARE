import express from "express";
import { json } from "body-parser";
import { FoodRouter } from "./routes/FoodRouter";
import cors from "cors";
import { errorHandler } from "./controllers/ErrorController";

export class App {
  public app: express.Application;
  public foodRouter: FoodRouter;

  constructor() {
    this.app = express();
    this.foodRouter = new FoodRouter();
    this.setMiddlewares();
    this.setRoutes();
    this.handle404Errors();
  }

  setMiddlewares() {
    this.app.use(cors());
    this.app.use(json());
  }
  setRoutes() {
    this.app.use("/api/v1", this.foodRouter.router);
    this.app.all("*",(req, res, next) => {
        try {
            throw new Error("Route not found");
        } catch (err) {
            next(err);
        }
    });
}
  handle404Errors() {
    this.app.use(errorHandler);
  }
}
// Crear una instancia de la aplicación y comenzar la aplicación
const app = new App();
