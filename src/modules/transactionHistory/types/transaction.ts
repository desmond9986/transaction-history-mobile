export const TRANSACTION_QUERY_KEY = ['transactions'] as const;
export const TRANSACTION_TYPES = ['debit', 'credit'] as const;

export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export type Transaction = {
    id: string;
    amount: number;
    date: string;
    description: string;
    category: string;
    type: TransactionType;
};
