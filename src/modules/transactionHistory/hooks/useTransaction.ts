import { useQuery } from '@tanstack/react-query';

import { getTransactionById } from '../services/mockTransactionService';

export function useTransaction(transactionId: string) {
    return useQuery({
        queryKey: ['transactions', transactionId],
        queryFn: () => getTransactionById(transactionId),
    });
}
