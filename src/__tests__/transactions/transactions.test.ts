import { unlink, writeFile } from "fs/promises";
import getWithdrawn from "../../logic/transactions/getWithdrawn";
import {
    ceilToCents,
    handleCashIn,
    handleTransactionList,
} from "../../logic/transactions/handleTransaction";
import {
    Transaction,
    TransactionCurrency,
    TransactionType,
    TransactionUserType,
} from "../../logic/transactions/types";
import readJSON from "../../utils/readJSON";

describe("operations", () => {
    const transaction: Transaction = {
        date: "2016-01-05",
        user_id: 23802,
        user_type: TransactionUserType.natural,
        type: TransactionType.cash_in,
        operation: { amount: 200.0, currency: TransactionCurrency.EUR },
    };

    it("should read file", async () => {
        const path = "./test_read.json";

        try {
            await writeFile(path, JSON.stringify(transaction));

            const readData = await readJSON(path);

            expect(readData).toEqual(transaction);
        } finally {
            await unlink(path);
        }
    });

    it("should save withdrawn", async () => {
        await getWithdrawn(transaction, transaction.operation.currency);

        const withdrawn = await getWithdrawn(
            transaction,
            transaction.operation.currency
        );

        expect(withdrawn.amount).toBe(transaction.operation.amount);
    });

    it("should handle cash in", () => {
        expect(handleCashIn(transaction)).resolves.toBe(0.06);
    });

    it("should handle cash out", async () => {
        const transactionList = (
            await readJSON<Transaction[]>("./src/test.json")
        ).filter(({ type }) => type === TransactionType.cash_out);

        const result = await handleTransactionList(transactionList);

        expect(result).toEqual([0.9, 87, 3, 0.3, 0.3, 0, 0]);
    });

    it("should ceil to cents", async () => {
        const result = ceilToCents(0.023);

        expect(result).toBe(0.03);
    });
});
