import { QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { BiometricAuthGate } from './src/modules/auth/components/BiometricAuthGate';
import { AppNavigator } from './src/navigation/AppNavigator';
import { queryClient } from './src/shared/query/queryClient';

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <SafeAreaProvider>
                <BiometricAuthGate>
                    <AppNavigator />
                </BiometricAuthGate>
                <StatusBar style="auto" />
            </SafeAreaProvider>
        </QueryClientProvider>
    );
}
