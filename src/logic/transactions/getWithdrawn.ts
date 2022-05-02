import moment from "moment";
import convert from "../../services/exchange/convert";
import config from "../../utils/config";
import { Transaction, TransactionCurrency } from "./types";

// getWithdrawn
export default (() => {
    // We are going to store all amounts in `DEFAULT_CURRENCY`
    const cashOutMap = new Map<string, number>();

    return async (
        { user_id, date, operation }: Transaction,
        getInCurrency: TransactionCurrency
    ) => {
        const key = `${user_id}_${moment(date)
            .startOf("isoWeek")
            .isoWeekday(1)
            .get("isoWeek")}`;

        const withdrawn = cashOutMap.get(key) || 0;

        const convertedOperation = await convert(
            operation,
            config.DEFAULT_CURRENCY
        );

        cashOutMap.set(key, withdrawn + convertedOperation.amount);

        // Return withdrawn amount converted to desired currency
        return convert(
            { amount: withdrawn, currency: config.DEFAULT_CURRENCY },
            getInCurrency
        );
    };
})();
