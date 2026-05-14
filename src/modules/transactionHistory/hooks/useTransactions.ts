import { useQuery } from '@tanstack/react-query';

import { getTransactions } from '../services/mockTransactionService';
import { TRANSACTION_QUERY_KEY } from '../types/transaction';

export function useTransactions() {
    return useQuery({
        queryKey: TRANSACTION_QUERY_KEY,
        queryFn: getTransactions,
    });
}
