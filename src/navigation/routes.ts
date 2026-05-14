import type { AppStackParamList } from './types';

export const AppRoute = {
    TransactionHistoryStack: 'TransactionHistoryStack',
} as const satisfies Record<keyof AppStackParamList, keyof AppStackParamList>;
