import { readFile } from "fs/promises";
import { resolve } from "path";
import config from "./config";

export default async (path: string) => {
    const url = config.IS_PRODUCTION
        ? resolve(process.cwd(), path)
        : resolve(__dirname, "./test.json");

    return JSON.parse(
        await readFile(url, {
            encoding: "utf8",
        })
    );
};
