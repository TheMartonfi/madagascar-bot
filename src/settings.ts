import dotenv from "dotenv";
dotenv.config();

export const PREFIX = process.env.PREFIX || "!";
export const { BOT_TOKEN } = process.env;

export const { RICO_USER_ID } = process.env;
export const { RICO_TRIGGER } = process.env;
export const { RICO_ROOM_ID } = process.env;