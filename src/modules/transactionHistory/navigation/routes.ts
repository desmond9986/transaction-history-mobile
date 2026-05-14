import type { TransactionHistoryStackParamList } from './types';

export const TransactionHistoryRoute = {
    TransactionHistory: 'TransactionHistory',
    TransactionDetail: 'TransactionDetail',
} as const satisfies Record<
    keyof TransactionHistoryStackParamList,
    keyof TransactionHistoryStackParamList
>;
