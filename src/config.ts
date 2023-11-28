import { config as dotenv } from 'dotenv';

dotenv();

export interface Configuration {
  port: number;
}

export const config = {
  port: parseInt(process.env.API_PORT as string, 10) || 3000
} satisfies Configuration;
