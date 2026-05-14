import { useCallback, useEffect, useState, type PropsWithChildren } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '../../../shared/components/Screen';
import { COLORS, RADIUS, SPACING } from '../../../shared/theme/tokens';
import { BiometricAuthResult, requestBiometricAuth } from '../services/biometricAuthService';

type AuthStatus = 'checking' | BiometricAuthResult;

export function BiometricAuthGate({ children }: PropsWithChildren) {
    const [authStatus, setAuthStatus] = useState<AuthStatus>('checking');

    const authenticate = useCallback(async () => {
        setAuthStatus('checking');

        const result: BiometricAuthResult = await requestBiometricAuth({
            promptMessage: 'Unlock transaction history',
            promptSubtitle: 'Use biometrics to continue',
        });

        setAuthStatus(result);
    }, []);

    useEffect(() => {
        void authenticate();
    }, [authenticate]);

    if (authStatus === 'authenticated') {
        return <>{children}</>;
    }

    if (authStatus === 'checking') {
        return <Screen style={styles.screen} />;
    }

    const title =
        authStatus === 'unavailable'
            ? 'Biometric authentication unavailable'
            : 'Authentication required';
    const message =
        authStatus === 'unavailable'
            ? 'Set up Face ID, Touch ID, or fingerprint unlock on this device to continue.'
            : 'Use biometrics to unlock transaction history.';

    return (
        <Screen style={styles.screen}>
            <View style={styles.stateContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.message}>{message}</Text>
                <Pressable style={styles.retryButton} onPress={() => void authenticate()}>
                    <Text style={styles.retryButtonText}>Try again</Text>
                </Pressable>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    screen: {
        justifyContent: 'center',
    },
    stateContainer: {
        alignItems: 'center',
        gap: SPACING.space12,
    },
    title: {
        color: COLORS.textPrimary,
        fontSize: 18,
        fontWeight: '800',
        textAlign: 'center',
    },
    message: {
        color: COLORS.textSecondary,
        fontSize: 15,
        textAlign: 'center',
    },
    retryButton: {
        marginTop: SPACING.space8,
        paddingHorizontal: SPACING.space16,
        paddingVertical: SPACING.space8,
        backgroundColor: COLORS.brandSoft,
        borderRadius: RADIUS.small,
    },
    retryButtonText: {
        color: COLORS.brandPrimary,
        fontSize: 15,
        fontWeight: '800',
    },
});
