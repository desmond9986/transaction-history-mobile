import * as LocalAuthentication from 'expo-local-authentication';

export type BiometricAuthResult = 'authenticated' | 'cancelled' | 'failed' | 'unavailable';

type RequestBiometricAuthOptions = {
    promptMessage: string;
    promptSubtitle?: string;
};

export async function requestBiometricAuth({
    promptMessage,
    promptSubtitle,
}: RequestBiometricAuthOptions): Promise<BiometricAuthResult> {
    try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();

        if (!hasHardware || !isEnrolled) {
            return 'unavailable';
        }

        const result = await LocalAuthentication.authenticateAsync({
            promptMessage,
            promptSubtitle,
            fallbackLabel: '',
            cancelLabel: 'Cancel',
            disableDeviceFallback: true,
        });

        if (result.success) {
            return 'authenticated';
        }

        return result.error === 'user_cancel' ? 'cancelled' : 'failed';
    } catch {
        return 'failed';
    }
}
