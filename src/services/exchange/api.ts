import { TransactionCurrency } from "../../logic/transactions/types";

// Mocking API for future use
// We will consider Euro to be our base currency with value of 1
const currencyList = { EUR: 1, USD: 0.91 } as const;
export default async (currency: TransactionCurrency): Promise<number> =>
    new Promise((resolve) => {
        setTimeout(() => resolve(currencyList[currency]), 2000);
    });
