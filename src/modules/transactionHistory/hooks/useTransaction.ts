import { useQueryClient } from '@tanstack/react-query';

import { TRANSACTION_QUERY_KEY, type Transaction } from '../types/transaction';

export function useTransaction(transactionId: string): Transaction | undefined {
    const queryClient = useQueryClient();
    const transactions = queryClient.getQueryData<Transaction[]>(TRANSACTION_QUERY_KEY);

    return transactions?.find(({ id }) => id === transactionId);
}
