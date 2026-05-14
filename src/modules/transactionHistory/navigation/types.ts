import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type TransactionHistoryStackParamList = {
    TransactionHistory: undefined;
    TransactionDetail: {
        transactionId: string;
    };
};

export type TransactionHistoryStackScreenProps<
    RouteName extends keyof TransactionHistoryStackParamList,
> = NativeStackScreenProps<TransactionHistoryStackParamList, RouteName>;
