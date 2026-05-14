import type { Transaction } from '../types/transaction';

export function formatTransactionType(type: Transaction['type']) {
    return type === 'credit' ? 'Credit' : 'Debit';
}

export function formatTransactionDate(date: string) {
    // Using the user's locale by passing `undefined` as the first argument
    return new Intl.DateTimeFormat(undefined, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(date));
}

export function formatTransactionAmount(transaction: Transaction) {
    const sign = transaction.type === 'credit' ? '+' : '-';
    const amount = new Intl.NumberFormat('en-MY', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(transaction.amount);

    return `${sign}RM ${amount}`;
}
