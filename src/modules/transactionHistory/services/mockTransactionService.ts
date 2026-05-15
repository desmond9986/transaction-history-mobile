import mockTransactionsJson from '../test/mockTransactions.json';
import type { Transaction } from '../types/transaction';
import { validateTransactions } from '../utils/transactionValidators';

const MOCK_TRANSACTION_DELAY_MS = 2000;

export async function getTransactions(): Promise<Transaction[]> {
    // Keep the mock asynchronous so loading and pull-to-refresh states are testable.
    await new Promise((resolve) => setTimeout(resolve, MOCK_TRANSACTION_DELAY_MS));
    return validateTransactions(mockTransactionsJson);
}
