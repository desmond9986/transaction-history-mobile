import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '../../../shared/components/Screen';
import { COLORS, RADIUS, SPACING } from '../../../shared/theme/tokens';
import { useTransaction } from '../hooks/useTransaction';
import { TransactionHistoryRoute } from '../navigation/routes';
import { useTransactionAmountVisibility } from '../state/TransactionAmountVisibilityContext';
import type { TransactionHistoryStackScreenProps } from '../navigation/types';
import type { Transaction } from '../types/transaction';
import {
    MASKED_TRANSACTION_AMOUNT,
    formatTransactionAmount,
    formatTransactionDateTime,
    formatTransactionType,
} from '../utils/transactionFormatters';

type TransactionDetailScreenProps = TransactionHistoryStackScreenProps<
    typeof TransactionHistoryRoute.TransactionDetail
>;

type DetailRow = {
    label: string;
    value: string;
};

export function TransactionDetailScreen({ navigation, route }: TransactionDetailScreenProps) {
    const transaction = useTransaction(route.params.transactionId);
    const { isAmountVisible, isAuthenticatingAmount, toggleAmountVisibility } =
        useTransactionAmountVisibility();

    function renderUnavailableState() {
        return (
            <View style={styles.stateContainer}>
                <Text style={styles.stateTitle}>Transaction unavailable</Text>
                <Pressable style={styles.retryButton} onPress={navigation.goBack}>
                    <Text style={styles.retryButtonText}>Back to history</Text>
                </Pressable>
            </View>
        );
    }

    function renderAmountVisibilityButton() {
        const amountVisibilityIconName = isAmountVisible ? 'eye-off-outline' : 'eye-outline';

        return (
            <Pressable
                accessibilityLabel={isAmountVisible ? 'Hide amount' : 'Show amount'}
                accessibilityRole="button"
                accessibilityState={{ disabled: isAuthenticatingAmount }}
                disabled={isAuthenticatingAmount}
                hitSlop={SPACING.space8}
                style={styles.amountVisibilityButton}
                onPress={() => void toggleAmountVisibility()}
            >
                <Ionicons name={amountVisibilityIconName} size={22} color={COLORS.brandPrimary} />
            </Pressable>
        );
    }

    function renderAmountRow(activeTransaction: Transaction) {
        const visibleAmountStyle =
            activeTransaction.type === 'credit' ? styles.creditAmount : styles.debitAmount;
        const amountStyle = isAmountVisible ? visibleAmountStyle : styles.maskedAmount;
        const amountText = isAmountVisible
            ? formatTransactionAmount(activeTransaction)
            : MASKED_TRANSACTION_AMOUNT;

        return (
            <View style={styles.amountRow}>
                <Text
                    style={[styles.amount, amountStyle]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.75}
                >
                    {amountText}
                </Text>
                {renderAmountVisibilityButton()}
            </View>
        );
    }

    function renderHeroMeta(activeTransaction: Transaction) {
        return (
            <>
                <Text style={styles.description} numberOfLines={2}>
                    {activeTransaction.description}
                </Text>
                <Text style={styles.meta}>{formatTransactionType(activeTransaction.type)}</Text>
            </>
        );
    }

    function renderHero(activeTransaction: Transaction) {
        return (
            <View style={styles.detailHero}>
                {renderAmountRow(activeTransaction)}
                {renderHeroMeta(activeTransaction)}
            </View>
        );
    }

    function renderDetailRows(detailRows: DetailRow[]) {
        return (
            <View style={styles.detailGrid}>
                {detailRows.map((row) => (
                    <View key={row.label} style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{row.label}</Text>
                        <Text style={styles.detailValue} numberOfLines={2}>
                            {row.value}
                        </Text>
                    </View>
                ))}
            </View>
        );
    }

    if (!transaction) {
        return (
            <Screen includeTopInset={false} style={styles.screen}>
                {renderUnavailableState()}
            </Screen>
        );
    }

    const detailRows: DetailRow[] = [
        {
            label: 'Posted',
            value: formatTransactionDateTime(transaction.date),
        },
        {
            label: 'Reference',
            value: transaction.id.toUpperCase(),
        },
        {
            label: 'Category',
            value: transaction.category,
        },
    ];

    return (
        <Screen includeTopInset={false} style={styles.screen}>
            <View style={styles.detailCard}>
                {renderHero(transaction)}
                {renderDetailRows(detailRows)}
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    screen: {
        paddingTop: SPACING.space8,
    },
    detailCard: {
        marginTop: SPACING.space8,
        padding: SPACING.space20,
        backgroundColor: COLORS.screenBackground,
        borderColor: COLORS.borderSubtle,
        borderRadius: RADIUS.large,
        borderWidth: StyleSheet.hairlineWidth,
    },
    detailHero: {
        alignItems: 'center',
        gap: SPACING.space12,
        paddingHorizontal: SPACING.space8,
        paddingVertical: SPACING.space24,
    },
    amountRow: {
        maxWidth: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.space8,
    },
    amount: {
        flexShrink: 1,
        fontSize: 38,
        fontWeight: '900',
        textAlign: 'center',
    },
    creditAmount: {
        color: COLORS.creditText,
    },
    debitAmount: {
        color: COLORS.debitText,
    },
    maskedAmount: {
        color: COLORS.textSecondary,
    },
    amountVisibilityButton: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: RADIUS.small,
        backgroundColor: COLORS.brandSoft,
    },
    description: {
        color: COLORS.textPrimary,
        fontSize: 18,
        fontWeight: '800',
        textAlign: 'center',
    },
    meta: {
        color: COLORS.textSecondary,
        fontSize: 13,
        fontWeight: '500',
        textAlign: 'center',
    },
    detailGrid: {
        gap: SPACING.space12,
        marginTop: SPACING.space8,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: SPACING.space20,
        paddingTop: SPACING.space12,
        borderTopColor: COLORS.borderSubtle,
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    detailLabel: {
        color: COLORS.textSecondary,
        fontSize: 13,
    },
    detailValue: {
        flex: 1,
        color: COLORS.textPrimary,
        fontSize: 13,
        fontWeight: '800',
        textAlign: 'right',
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
