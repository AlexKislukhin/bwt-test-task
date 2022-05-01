import fetchCurrencyRate from "./api";
import {
    Transaction,
    TransactionCurrency,
} from "../../logic/transactions/types";

const getCurrencyRate = (() => {
    const rateList = new Map<TransactionCurrency, Promise<number>>();

    return (currency: TransactionCurrency) => {
        if (!rateList.has(currency)) {
            rateList.set(currency, fetchCurrencyRate(currency));
        }

        return rateList.get(currency)!;
    };
})();

export default async (
    { amount, currency }: Transaction["operation"],
    convertTo: TransactionCurrency
): Promise<Transaction["operation"]> => {
    if (currency === convertTo) {
        return { amount, currency };
    }

    const [baseCurrency, newCurrency] = await Promise.all([
        getCurrencyRate(currency),
        getCurrencyRate(convertTo),
    ]);

    return {
        amount: (amount * baseCurrency) / newCurrency,
        currency: convertTo,
    };
};
