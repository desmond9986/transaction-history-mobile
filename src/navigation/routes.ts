import type { AppStackParamList } from './types';

export const AppRoute = {
    TransactionHistory: 'TransactionHistory',
} as const satisfies Record<keyof AppStackParamList, keyof AppStackParamList>;
