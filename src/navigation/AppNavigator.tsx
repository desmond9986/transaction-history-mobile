import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { TransactionHistoryNavigator } from '../modules/transactionHistory/navigation/TransactionHistoryNavigator';
import { AppRoute } from './routes';
import type { AppStackParamList } from './types';

const Stack = createNativeStackNavigator<AppStackParamList>();

const navigationTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: '#ffffff',
        card: '#ffffff',
    },
};

function renderAppStackScreens() {
    return (
        <>
            <Stack.Screen
                name={AppRoute.TransactionHistory}
                component={TransactionHistoryNavigator}
            />
        </>
    );
}

export function AppNavigator() {
    return (
        <NavigationContainer theme={navigationTheme}>
            <Stack.Navigator
                initialRouteName={AppRoute.TransactionHistory}
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: '#ffffff' },
                }}
            >
                {renderAppStackScreens()}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
