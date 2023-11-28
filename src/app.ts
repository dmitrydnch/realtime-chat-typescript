import express from 'express';
import { config } from './config';
import * as path from 'path';
import { bootstrapWsServer } from './socket/server';

const app = express();

app.use(express.static(path.join(process.cwd(), 'public')));

export const bootstrap = () => {
  bootstrapWsServer(app.listen(config.port, () => console.log(`HTTP Server was started on port :${config.port}`)));
  console.log(`Socket.io Server was started on port :${config.port}`);
};
