import { Button, Text } from 'react-native';

import { Screen } from '../../../shared/components/Screen';
import { TransactionHistoryRoute } from '../navigation/routes';
import type { TransactionHistoryStackScreenProps } from '../navigation/types';

type TransactionHistoryScreenProps = TransactionHistoryStackScreenProps<
    typeof TransactionHistoryRoute.TransactionHistory
>;

export function TransactionHistoryScreen({ navigation }: TransactionHistoryScreenProps) {
    return (
        <Screen>
            <Text>Transaction history</Text>
            <Button
                title="Open sample transaction"
                onPress={() =>
                    navigation.navigate(TransactionHistoryRoute.TransactionDetail, {
                        transactionId: 'sample-001',
                    })
                }
            />
        </Screen>
    );
}
