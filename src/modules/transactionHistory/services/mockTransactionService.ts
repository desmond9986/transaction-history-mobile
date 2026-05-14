import { mockTransactions } from '../test/mockTransactions';
import type { Transaction } from '../types/transaction';

export async function getTransactions(): Promise<Transaction[]> {
    return mockTransactions;
}

export async function getTransactionById(transactionId: string): Promise<Transaction | undefined> {
    return mockTransactions.find(({ id }) => id === transactionId);
}
