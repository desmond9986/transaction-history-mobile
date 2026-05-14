import { useCallback, useState, type ReactElement } from 'react';
import {
    FlatList,
    Pressable,
    RefreshControl,
    StyleSheet,
    Text,
    View,
    type ListRenderItem,
} from 'react-native';

import { Screen } from '../../../shared/components/Screen';
import { SkeletonBox } from '../../../shared/components/SkeletonBox';
import { COLORS, RADIUS, SPACING } from '../../../shared/theme/tokens';
import { TransactionRow } from '../components/TransactionRow';
import { useTransactions } from '../hooks/useTransactions';
import { TransactionHistoryRoute } from '../navigation/routes';
import { useTransactionAmountVisibility } from '../state/TransactionAmountVisibilityContext';
import type { TransactionHistoryStackScreenProps } from '../navigation/types';
import type { Transaction } from '../types/transaction';
import { getTransactionErrorMessage } from '../utils/transactionErrors';

type TransactionHistoryScreenProps = TransactionHistoryStackScreenProps<
    typeof TransactionHistoryRoute.TransactionHistory
>;

export function TransactionHistoryScreen({ navigation }: TransactionHistoryScreenProps) {
    const [refreshErrorMessage, setRefreshErrorMessage] = useState<string | null>(null);
    const { isAmountVisible, isAuthenticatingAmount, toggleAmountVisibility } =
        useTransactionAmountVisibility();
    const {
        data: transactions = [],
        error,
        isError,
        isLoading,
        isRefetching,
        refetch,
    } = useTransactions();
    const hasTransactions = transactions.length > 0;

    const openTransactionDetail = useCallback(
        (transactionId: string) => {
            navigation.navigate(TransactionHistoryRoute.TransactionDetail, {
                transactionId,
            });
        },
        [navigation],
    );

    const keyExtractor = useCallback((transaction: Transaction) => transaction.id, []);

    const renderTransactionItem = useCallback<ListRenderItem<Transaction>>(
        ({ item }) => (
            <TransactionRow
                isAmountVisible={isAmountVisible}
                transaction={item}
                onPressTransaction={openTransactionDetail}
            />
        ),
        [isAmountVisible, openTransactionDetail],
    );

    const refreshTransactions = useCallback(async () => {
        setRefreshErrorMessage(null);

        const result = await refetch();
        if (result.isError && hasTransactions) {
            // Keep cached rows visible when refresh fails; show the failure inline instead.
            setRefreshErrorMessage(getTransactionErrorMessage(result.error));
        }
    }, [hasTransactions, refetch]);

    function renderHeader() {
        return (
            <View style={styles.header}>
                <Text style={styles.title}>Transactions</Text>
                <Pressable
                    accessibilityState={{ disabled: isAuthenticatingAmount }}
                    disabled={isAuthenticatingAmount}
                    style={styles.amountToggleButton}
                    onPress={() => void toggleAmountVisibility()}
                >
                    <Text style={styles.amountToggleButtonText}>
                        {isAmountVisible ? 'Hide amount' : 'Show amount'}
                    </Text>
                </Pressable>
            </View>
        );
    }

    function renderLoadingState() {
        const loadingRows: ReactElement[] = [];

        for (let index = 0; index < 5; index += 1) {
            loadingRows.push(
                <View key={`loading-row-${index}`} style={styles.loadingRow}>
                    <View style={styles.loadingCopy}>
                        <SkeletonBox style={styles.loadingTitlePlaceholder} />
                        <SkeletonBox style={styles.loadingMetaPlaceholder} />
                    </View>
                    <SkeletonBox style={styles.loadingAmountPlaceholder} />
                </View>,
            );
        }

        return (
            <View
                style={styles.loadingList}
                accessibilityRole="progressbar"
                accessibilityLabel="Loading transactions"
            >
                {loadingRows}
            </View>
        );
    }

    function renderErrorState(message: string) {
        return (
            <View style={styles.stateContainer}>
                <Text style={styles.stateTitle}>Unable to load transactions</Text>
                <Text style={styles.stateText}>{message}</Text>
                <Pressable style={styles.retryButton} onPress={() => void refreshTransactions()}>
                    <Text style={styles.retryButtonText}>Try again</Text>
                </Pressable>
            </View>
        );
    }

    function renderRefreshError() {
        if (!refreshErrorMessage) {
            return null;
        }

        return (
            <View style={styles.refreshError}>
                <Text style={styles.refreshErrorTitle}>Refresh failed</Text>
                <Text style={styles.refreshErrorText}>{refreshErrorMessage}</Text>
            </View>
        );
    }

    function renderTransactionList() {
        return (
            <FlatList
                data={transactions}
                keyExtractor={keyExtractor}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={() => void refreshTransactions()}
                        tintColor={COLORS.brandPrimary}
                        colors={[COLORS.brandPrimary]}
                    />
                }
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={renderRefreshError()}
                ListEmptyComponent={<Text style={styles.stateText}>No transactions found.</Text>}
                renderItem={renderTransactionItem}
            />
        );
    }

    function renderContent() {
        if (isLoading) {
            return renderLoadingState();
        }

        if (isError && !hasTransactions) {
            return renderErrorState(getTransactionErrorMessage(error));
        }

        return renderTransactionList();
    }

    return (
        <Screen style={styles.screen}>
            {renderHeader()}
            {renderContent()}
        </Screen>
    );
}

const styles = StyleSheet.create({
    screen: {
        paddingTop: SPACING.space16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: SPACING.space24,
    },
    title: {
        flex: 1,
        color: COLORS.textPrimary,
        fontSize: 30,
        fontWeight: '800',
        lineHeight: 34,
    },
    amountToggleButton: {
        paddingHorizontal: SPACING.space12,
        paddingVertical: SPACING.space8,
        backgroundColor: COLORS.brandSoft,
        borderRadius: RADIUS.small,
    },
    amountToggleButtonText: {
        color: COLORS.brandPrimary,
        fontSize: 14,
        fontWeight: '800',
    },
    listContent: {
        paddingBottom: SPACING.space24,
    },
    loadingList: {
        gap: SPACING.space8,
    },
    loadingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: SPACING.space16,
        paddingVertical: SPACING.space16,
        borderBottomColor: COLORS.borderSubtle,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    loadingCopy: {
        flex: 1,
        gap: SPACING.space8,
    },
    loadingTitlePlaceholder: {
        width: '62%',
        height: 16,
    },
    loadingMetaPlaceholder: {
        width: '42%',
        height: 12,
    },
    loadingAmountPlaceholder: {
        width: 82,
        height: 16,
    },
    stateContainer: {
        alignItems: 'center',
        gap: SPACING.space12,
        paddingTop: SPACING.space24,
    },
    stateTitle: {
        color: COLORS.textPrimary,
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
    },
    stateText: {
        color: COLORS.textSecondary,
        fontSize: 15,
        textAlign: 'center',
    },
    refreshError: {
        gap: SPACING.space4,
        marginBottom: SPACING.space12,
        padding: SPACING.space12,
        backgroundColor: COLORS.errorSoft,
        borderRadius: RADIUS.small,
    },
    refreshErrorTitle: {
        color: COLORS.errorText,
        fontSize: 14,
        fontWeight: '800',
    },
    refreshErrorText: {
        color: COLORS.errorText,
        fontSize: 13,
    },
    retryButton: {
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
