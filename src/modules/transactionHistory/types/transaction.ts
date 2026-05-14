export type TransactionType = 'debit' | 'credit';

export type Transaction = {
    id: string;
    amount: number;
    date: string;
    description: string;
    category: string;
    type: TransactionType;
};
