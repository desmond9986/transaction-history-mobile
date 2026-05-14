import { useCallback, type ReactElement } from 'react';
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

type TransactionHistoryScreenProps = TransactionHistoryStackScreenProps<
    typeof TransactionHistoryRoute.TransactionHistory
>;

export function TransactionHistoryScreen({ navigation }: TransactionHistoryScreenProps) {
    const { isAmountVisible, isAuthenticatingAmount, toggleAmountVisibility } =
        useTransactionAmountVisibility();
    const {
        data: transactions = [],
        isError,
        isLoading,
        isRefetching,
        refetch,
    } = useTransactions();

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

    function renderErrorState() {
        return (
            <View style={styles.stateContainer}>
                <Text style={styles.stateTitle}>Unable to load transactions</Text>
                <Pressable style={styles.retryButton} onPress={() => void refetch()}>
                    <Text style={styles.retryButtonText}>Try again</Text>
                </Pressable>
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
                        onRefresh={() => void refetch()}
                        tintColor={COLORS.brandPrimary}
                        colors={[COLORS.brandPrimary]}
                    />
                }
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<Text style={styles.stateText}>No transactions found.</Text>}
                renderItem={renderTransactionItem}
            />
        );
    }

    function renderContent() {
        if (isLoading) {
            return renderLoadingState();
        }

        if (isError) {
            return renderErrorState();
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
