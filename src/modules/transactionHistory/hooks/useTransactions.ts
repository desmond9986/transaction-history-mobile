import { useQuery } from '@tanstack/react-query';

import { getTransactions } from '../services/mockTransactionService';

export function useTransactions() {
    return useQuery({
        queryKey: ['transactions'],
        queryFn: getTransactions,
    });
}
