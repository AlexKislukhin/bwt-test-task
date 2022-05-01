import { config } from "dotenv";
import { TransactionCurrency } from "../logic/transactions/types";

config();

export default {
    PAYSERA_API_URL: process.env.PAYSERA_API_URL,
    DEFAULT_CURRENCY: TransactionCurrency.EUR,
    IS_PRODUCTION: process.env.NODE_ENV !== "development",
} as const;
