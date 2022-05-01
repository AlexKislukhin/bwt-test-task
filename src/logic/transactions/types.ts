export enum TransactionUserType {
    natural = "natural",
    juridical = "juridical",
}

export enum TransactionType {
    cash_in = "cash_in",
    cash_out = "cash_out",
}

export enum TransactionCurrency {
    EUR = "EUR",
    USD = "USD",
}

export interface Transaction {
    date: string;
    user_id: number;
    user_type: TransactionUserType;
    type: TransactionType;
    operation: {
        amount: number;
        currency: TransactionCurrency;
    };
}

export type TransactionRates =
    | TransactionCashInConfig
    | TransactionCashOutNaturalConfig
    | TransactionCashOutJuridicalConfig;

export interface TransactionCashInConfig {
    percents: number;
    max: {
        amount: number;
        currency: TransactionCurrency;
    };
}

export interface TransactionCashOutNaturalConfig {
    percents: number;
    week_limit: {
        amount: number;
        currency: TransactionCurrency;
    };
}

export interface TransactionCashOutJuridicalConfig {
    percents: number;
    min: {
        amount: number;
        currency: TransactionCurrency;
    };
}
