import dotenv from "dotenv";
import chalk from "chalk";
dotenv.config();

export const PREFIX = process.env.PREFIX || "!";
export const DB_MIGRATE = process.env.DB_MIGRATE ? true : false;
export const DB_SEED = process.env.DB_SEED ? true : false;
export const DB_RESET = process.env.DB_RESET ? true : false;
export const MEMES_GUILD_ID = process.env.MEMES_GUILD_ID ? true : false;

export const { ENV } = process.env;
export const { DATABASE_URL } = process.env;
export const { BOT_TOKEN } = process.env;
export const { PRIVATE_GUILD_ID } = process.env;

export const { RICO_USER_ID } = process.env;
export const { RICO_TRIGGER } = process.env;
export const { RICO_ROOM_ID } = process.env;

export const info = chalk.blue;
export const sql = chalk.yellow;
export const error = chalk.red;
