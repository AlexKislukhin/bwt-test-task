import { handleTransactionList } from "./logic/transactions/handleTransaction";
import { Transaction } from "./logic/transactions/types";
import readJSON from "./utils/readJSON";

const start = async () => {
    const transactionList = await readJSON<Transaction[]>(process.argv[2]);
    const result = await handleTransactionList(transactionList);

    // eslint-disable-next-line no-console
    result.forEach((item) => console.log(item.toFixed(2)));
};

start();
