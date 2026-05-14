import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { COLORS } from '../../../shared/theme/tokens';
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
                options={{
                    headerShown: true,
                    title: '',
                    headerBackButtonDisplayMode: 'minimal',
                    headerShadowVisible: false,
                    headerStyle: {
                        backgroundColor: COLORS.screenBackground,
                    },
                }}
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
                contentStyle: { backgroundColor: COLORS.screenBackground },
            }}
        >
            {renderTransactionHistoryStackScreens()}
        </Stack.Navigator>
    );
}
