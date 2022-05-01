import handleTransaction from "./logic/transactions/handleTransaction";
import readJSON from "./utils/readJSON";

const start = async () => {
    const transactionList = await readJSON(process.argv[2]);
    for (let i = 0; i < transactionList.length; i += 1) {
        const transaction = transactionList[i];
        // eslint-disable-next-line no-await-in-loop
        const data = await handleTransaction(transaction);
        // eslint-disable-next-line no-console
        console.log(data.toFixed(2));
    }
};

start();
