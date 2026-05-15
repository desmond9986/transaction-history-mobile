import { TRANSACTION_TYPES, type Transaction, type TransactionType } from '../types/transaction';

type JsonObject = Record<string, unknown>;

class TransactionDataFormatError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'TransactionDataFormatError';
    }
}

export function validateTransactions(value: unknown): Transaction[] {
    if (!Array.isArray(value)) {
        throw new TransactionDataFormatError('Transaction data must be an array.');
    }

    const transactions: Transaction[] = [];

    for (let index = 0; index < value.length; index += 1) {
        const transaction = value[index];

        if (!isTransaction(transaction)) {
            throw new TransactionDataFormatError(`Transaction data is invalid at index ${index}.`);
        }

        transactions.push(transaction);
    }

    return transactions;
}

function isTransaction(value: unknown): value is Transaction {
    if (!isJsonObject(value)) {
        return false;
    }

    return (
        isNonEmptyString(value.id) &&
        isPositiveFiniteNumber(value.amount) &&
        isValidDateString(value.date) &&
        isNonEmptyString(value.description) &&
        isNonEmptyString(value.category) &&
        isTransactionType(value.type)
    );
}

function isJsonObject(value: unknown): value is JsonObject {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0;
}

function isPositiveFiniteNumber(value: unknown): value is number {
    return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

function isValidDateString(value: unknown): value is string {
    return typeof value === 'string' && !Number.isNaN(Date.parse(value));
}

function isTransactionType(value: unknown): value is TransactionType {
    return TRANSACTION_TYPES.includes(value as TransactionType);
}
