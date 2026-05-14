import { useQueryClient } from '@tanstack/react-query';

import type { Transaction } from '../types/transaction';

export function useTransaction(transactionId: string) {
    const queryClient = useQueryClient();
    const transactions = queryClient.getQueryData<Transaction[]>(['transactions']);

    return transactions?.find(({ id }) => id === transactionId);
}
