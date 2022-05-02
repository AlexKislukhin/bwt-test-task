import convert from "../../services/exchange/convert";
import {
    Transaction,
    TransactionCashInConfig,
    TransactionCashOutJuridicalConfig,
    TransactionCashOutNaturalConfig,
    TransactionType,
    TransactionUserType,
} from "./types";
import getWithdrawn from "./getWithdrawn";
import getPayseraConfig from "../../services/paysera/getPayseraConfig";

export const ceilToCents = (number: number) => Math.ceil(number * 100) / 100;

export const handleCashIn = async (
    transaction: Transaction
): Promise<number> => {
    const {
        max: { currency, amount: max },
        percents,
    } = (await getPayseraConfig(transaction)) as TransactionCashInConfig;

    const { amount } = await convert(transaction.operation, currency);
    return Math.min((amount * percents) / 100, max);
};

export const handleCashOut = async (
    transaction: Transaction
): Promise<number> => {
    const transactionConfig = await getPayseraConfig(transaction);

    if (transaction.user_type === TransactionUserType.natural) {
        const {
            week_limit: { amount: limit, currency },
            percents,
        } = transactionConfig as TransactionCashOutNaturalConfig;

        const { amount: withdrawn } = await getWithdrawn(transaction, currency);

        const {
            operation: { amount },
        } = transaction;

        if (amount + withdrawn - limit > 0) {
            return ((amount - Math.max(0, limit - withdrawn)) * percents) / 100;
        }

        return 0;
    }

    if (transaction.user_type === TransactionUserType.juridical) {
        const {
            min: { amount: min, currency },
            percents,
        } = transactionConfig as TransactionCashOutJuridicalConfig;

        const { amount } = await convert(transaction.operation, currency);

        return Math.max((amount * percents) / 100, min);
    }

    throw new Error(
        `[handleCashOut] - Couldn't find resolver for user type: ${transaction.user_type} was expecting ${TransactionUserType.natural}`
    );
};

export const handleTransaction = async (
    transaction: Transaction
): Promise<number> => {
    if (transaction.type === TransactionType.cash_in) {
        // eslint-disable-next-line no-await-in-loop
        return handleCashIn(transaction);
    }

    if (transaction.type === TransactionType.cash_out) {
        // eslint-disable-next-line no-await-in-loop
        return handleCashOut(transaction);
    }

    throw new Error(
        `[handleTransaction] - Couldn't find resolver for type: ${transaction.type}`
    );
};

export const handleTransactionList = async (transactionList: Transaction[]) => {
    const result: number[] = [];

    for (let i = 0; i < transactionList.length; i += 1) {
        // We need to execute them synchronized to correctly calculate commision
        // eslint-disable-next-line no-await-in-loop
        const data = await handleTransaction(transactionList[i]);
        result.push(ceilToCents(data));
    }

    return result;
};
