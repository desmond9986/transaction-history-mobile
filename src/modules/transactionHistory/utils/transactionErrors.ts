const DEFAULT_TRANSACTION_ERROR_MESSAGE = 'Please try again in a moment.';
const NETWORK_TRANSACTION_ERROR_MESSAGE = 'Please check your connection and try again.';

export function getTransactionErrorMessage(error: unknown): string {
    if (error instanceof TypeError) {
        return NETWORK_TRANSACTION_ERROR_MESSAGE;
    }

    return DEFAULT_TRANSACTION_ERROR_MESSAGE;
}
