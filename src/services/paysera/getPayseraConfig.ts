import {
    TransactionRates,
    TransactionType,
    TransactionUserType,
    Transaction,
} from "../../logic/transactions/types";
import fetchPayseraConfig from "./api";

// Store fetched configs in memory
export default (() => {
    const rateList = new Map<string, Promise<TransactionRates>>();

    function generateKey(
        type: TransactionType,
        user_type: TransactionUserType
    ) {
        return type === TransactionType.cash_in ? type : `${type}_${user_type}`;
    }

    return ({ type, user_type }: Pick<Transaction, "type" | "user_type">) => {
        const key = generateKey(type, user_type);
        if (!rateList.has(key)) {
            rateList.set(key, fetchPayseraConfig({ type, user_type }));
        }

        return rateList.get(key);
    };
})();
