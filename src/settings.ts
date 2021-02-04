import dotenv from "dotenv";
dotenv.config();

export const PREFIX = process.env.PREFIX || "!";
export const DB_MIGRATE = process.env.DB_MIGRATE ? true : false;
export const DB_SEED = process.env.DB_SEED ? true : false;
export const DB_RESET = process.env.DB_RESET ? true : false;

export const { ENV } = process.env;
export const { DATABASE_URL } = process.env;
export const { BOT_TOKEN } = process.env;
export const { PRIVATE_GUILD_ID } = process.env;

export const { RICO_USER_ID } = process.env;
export const { RICO_TRIGGER } = process.env;
export const { RICO_ROOM_ID } = process.env;

export const blue = "\x1b[34m%s\x1b[0m";
export const yellow = "\x1b[33m%s\x1b[0m";
export const red = "\x1b[31m%s\x1b[0m";
