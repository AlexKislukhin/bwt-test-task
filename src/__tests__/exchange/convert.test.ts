import { TransactionCurrency } from "../../logic/transactions/types";
import convert from "../../services/exchange/convert";

describe("convert", () => {
    it("should convert correctly", async () => {
        const baseValue = 100;
        const convertedValue = await convert(
            { amount: baseValue, currency: TransactionCurrency.EUR },
            TransactionCurrency.USD
        );

        const doubleConverted = await convert(
            convertedValue,
            TransactionCurrency.EUR
        );

        expect(doubleConverted.amount).toBe(baseValue);
    });
});
