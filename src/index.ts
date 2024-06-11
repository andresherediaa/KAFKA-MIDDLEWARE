import { App } from "./app";
require('dotenv').config(); 
const server = new App().app;
const port: number = 3000;

const start = async () => {
  server.listen(3000, () => {
    console.log("Listening on port 3000 Search");
  });
};
start();
