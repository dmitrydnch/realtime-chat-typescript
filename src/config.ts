import { config as dotenv } from "dotenv";

dotenv();

export interface Configuration {
  port: number,
  wsPort: number,
}

export const config = {
  port: parseInt(process.env.API_PORT as string, 10) || 3000,
  wsPort: parseInt(process.env.WS_PORT as string, 10) || 4000
} satisfies Configuration;
