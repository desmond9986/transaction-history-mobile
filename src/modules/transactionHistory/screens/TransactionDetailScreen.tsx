import { Button, Text } from 'react-native';

import { Screen } from '../../../shared/components/Screen';
import { TransactionHistoryRoute } from '../navigation/routes';
import type { TransactionHistoryStackScreenProps } from '../navigation/types';

type TransactionDetailScreenProps = TransactionHistoryStackScreenProps<
    typeof TransactionHistoryRoute.TransactionDetail
>;

export function TransactionDetailScreen({ navigation, route }: TransactionDetailScreenProps) {
    return (
        <Screen>
            <Text>Transaction detail</Text>
            <Text>Transaction ID: {route.params.transactionId}</Text>
            <Button title="Back" onPress={navigation.goBack} />
        </Screen>
    );
}
