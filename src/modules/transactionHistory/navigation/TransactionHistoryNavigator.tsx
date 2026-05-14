import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { TransactionDetailScreen } from '../screens/TransactionDetailScreen';
import { TransactionHistoryScreen } from '../screens/TransactionHistoryScreen';
import { TransactionHistoryRoute } from './routes';
import type { TransactionHistoryStackParamList } from './types';

const Stack = createNativeStackNavigator<TransactionHistoryStackParamList>();

function renderTransactionHistoryStackScreens() {
    return (
        <>
            <Stack.Screen
                name={TransactionHistoryRoute.TransactionHistory}
                component={TransactionHistoryScreen}
            />
            <Stack.Screen
                name={TransactionHistoryRoute.TransactionDetail}
                component={TransactionDetailScreen}
            />
        </>
    );
}

export function TransactionHistoryNavigator() {
    return (
        <Stack.Navigator
            initialRouteName={TransactionHistoryRoute.TransactionHistory}
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#ffffff' },
            }}
        >
            {renderTransactionHistoryStackScreens()}
        </Stack.Navigator>
    );
}
