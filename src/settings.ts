import dotenv from "dotenv";
dotenv.config();

export const PREFIX = process.env.PREFIX || "!";
export const DB_MIGRATE = process.env.DB_MIGRATE ? true : false;
export const DB_SEED = process.env.DB_SEED ? true : false;

export const { ENV } = process.env;
export const { DATABASE_URL } = process.env;
export const { BOT_TOKEN } = process.env;
export const { PRIVATE_GUILD_ID } = process.env;

export const { RICO_USER_ID } = process.env;
export const { RICO_TRIGGER } = process.env;
export const { RICO_ROOM_ID } = process.env;
