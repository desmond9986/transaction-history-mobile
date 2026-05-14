import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '../../../shared/components/Screen';
import { COLORS, RADIUS, SPACING } from '../../../shared/theme/tokens';
import { useTransaction } from '../hooks/useTransaction';
import { TransactionHistoryRoute } from '../navigation/routes';
import type { TransactionHistoryStackScreenProps } from '../navigation/types';
import type { Transaction } from '../types/transaction';
import {
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

    function renderHero(activeTransaction: Transaction) {
        const amountStyle =
            activeTransaction.type === 'credit' ? styles.creditAmount : styles.debitAmount;

        return (
            <View style={styles.detailHero}>
                <Text
                    style={[styles.amount, amountStyle]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.75}
                >
                    {formatTransactionAmount(activeTransaction)}
                </Text>
                <Text style={styles.description} numberOfLines={2}>
                    {activeTransaction.description}
                </Text>
                <Text style={styles.meta}>{formatTransactionType(activeTransaction.type)}</Text>
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
    amount: {
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
