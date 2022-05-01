import axios from "axios";
import {
    Transaction,
    TransactionRates,
    TransactionType,
    TransactionUserType,
} from "../../logic/transactions/types";
import config from "../../utils/config";

function getURL(type: TransactionType, user_type: TransactionUserType) {
    if (type === TransactionType.cash_in) {
        return `${config.PAYSERA_API_URL}/cash-in`;
    }

    return `${config.PAYSERA_API_URL}/${type.replace("_", "-")}-${user_type}`;
}

// fetchPayseraConfig
export default async ({
    type,
    user_type,
}: Pick<Transaction, "type" | "user_type">): Promise<TransactionRates> => {
    const { data } = await axios(getURL(type, user_type));

    return data as TransactionRates;
};
