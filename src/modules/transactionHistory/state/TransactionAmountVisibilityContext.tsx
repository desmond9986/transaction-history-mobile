import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type PropsWithChildren,
} from 'react';
import { Alert } from 'react-native';

import { requestBiometricAuth } from '../../auth/services/biometricAuthService';

type TransactionAmountVisibilityContextValue = {
    isAmountVisible: boolean;
    isAuthenticatingAmount: boolean;
    toggleAmountVisibility: () => Promise<void>;
};

const TransactionAmountVisibilityContext =
    createContext<TransactionAmountVisibilityContextValue | null>(null);

export function TransactionAmountVisibilityProvider({ children }: PropsWithChildren) {
    const [isAmountVisible, setIsAmountVisible] = useState(false);
    const [isAuthenticatingAmount, setIsAuthenticatingAmount] = useState(false);

    const hideAmount = useCallback(() => {
        setIsAmountVisible(false);
    }, []);

    // Revealing amounts is the sensitive action; hiding can happen immediately.
    const showAmount = useCallback(async () => {
        if (isAmountVisible || isAuthenticatingAmount) {
            return;
        }

        setIsAuthenticatingAmount(true);

        try {
            const result = await requestBiometricAuth({
                promptMessage: 'Show transaction amounts',
                promptSubtitle: 'Use biometrics to reveal amounts',
            });

            if (result === 'authenticated') {
                setIsAmountVisible(true);
                return;
            }

            if (result === 'cancelled') {
                // User cancellation is intentional, so keep amounts masked without an alert.
                return;
            }

            Alert.alert(
                result === 'unavailable'
                    ? 'Biometric authentication unavailable'
                    : 'Authentication failed',
                result === 'unavailable'
                    ? 'Set up Face ID, Touch ID, or fingerprint unlock on this device to show amounts.'
                    : 'Please try again to show transaction amounts.',
            );
        } finally {
            setIsAuthenticatingAmount(false);
        }
    }, [isAmountVisible, isAuthenticatingAmount]);

    const toggleAmountVisibility = useCallback(async () => {
        if (isAmountVisible) {
            hideAmount();
            return;
        }

        await showAmount();
    }, [hideAmount, isAmountVisible, showAmount]);

    const contextValue = useMemo(
        () => ({
            isAmountVisible,
            isAuthenticatingAmount,
            toggleAmountVisibility,
        }),
        [isAmountVisible, isAuthenticatingAmount, toggleAmountVisibility],
    );

    return (
        <TransactionAmountVisibilityContext.Provider value={contextValue}>
            {children}
        </TransactionAmountVisibilityContext.Provider>
    );
}

export function useTransactionAmountVisibility() {
    const contextValue = useContext(TransactionAmountVisibilityContext);

    if (!contextValue) {
        throw new Error(
            'useTransactionAmountVisibility must be used inside TransactionAmountVisibilityProvider',
        );
    }

    return contextValue;
}
