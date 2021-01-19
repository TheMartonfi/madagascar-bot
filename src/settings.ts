import dotenv from "dotenv";
dotenv.config();

export const PREFIX = process.env.PREFIX || "!";
// DB_MIGRATE
// DB_SEED
export const DB_RESET = process.env.DB_RESET ? true : false;

export const { ENV } = process.env;
export const { DB_URL } = process.env;
export const { BOT_TOKEN } = process.env;

export const { RICO_USER_ID } = process.env;
export const { RICO_TRIGGER } = process.env;
export const { RICO_ROOM_ID } = process.env;
export const { MADAGASCAR_GUILD_ID } = process.env;
