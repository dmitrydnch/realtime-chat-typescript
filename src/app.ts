import express from "express";
import { config } from "./config";
import * as path from "path";

const app = express();

app.use(express.static(path.join(process.cwd(), "public")));

export const bootstrap = () => {
  app.listen(config.port, () => console.log(`HTTP Server was started on port :${config.port}`));
};
