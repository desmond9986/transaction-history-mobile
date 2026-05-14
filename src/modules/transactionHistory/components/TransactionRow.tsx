import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS, SPACING } from '../../../shared/theme/tokens';
import type { Transaction } from '../types/transaction';
import {
    MASKED_TRANSACTION_AMOUNT,
    formatTransactionAmount,
    formatTransactionDate,
    formatTransactionType,
} from '../utils/transactionFormatters';

type TransactionRowProps = {
    isAmountVisible: boolean;
    transaction: Transaction;
    onPressTransaction: (transactionId: string) => void;
};

function TransactionRowComponent({
    isAmountVisible,
    transaction,
    onPressTransaction,
}: TransactionRowProps) {
    const visibleAmountStyle =
        transaction.type === 'credit' ? styles.creditAmount : styles.debitAmount;
    const amountStyle = isAmountVisible ? visibleAmountStyle : styles.maskedAmount;
    const amountText = isAmountVisible
        ? formatTransactionAmount(transaction)
        : MASKED_TRANSACTION_AMOUNT;

    function handlePress() {
        onPressTransaction(transaction.id);
    }

    return (
        <Pressable style={styles.transactionRow} onPress={handlePress}>
            <View style={styles.transactionCopy}>
                <Text style={styles.transactionDescription} numberOfLines={1}>
                    {transaction.description}
                </Text>
                <Text style={styles.transactionMeta} numberOfLines={1}>
                    {`${formatTransactionType(transaction.type)} - ${formatTransactionDate(transaction.date)}`}
                </Text>
            </View>

            <Text
                style={[styles.transactionAmount, amountStyle]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.8}
            >
                {amountText}
            </Text>
        </Pressable>
    );
}

export const TransactionRow = memo(TransactionRowComponent);

const styles = StyleSheet.create({
    transactionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: SPACING.space16,
        paddingVertical: SPACING.space16,
        borderBottomColor: COLORS.borderSubtle,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    transactionCopy: {
        flex: 1,
        minWidth: 0,
        gap: SPACING.space4,
    },
    transactionDescription: {
        color: COLORS.textPrimary,
        fontSize: 16,
        fontWeight: '700',
    },
    transactionMeta: {
        color: COLORS.textSecondary,
        fontSize: 13,
        fontWeight: '500',
    },
    transactionAmount: {
        minWidth: 104,
        textAlign: 'right',
        fontSize: 16,
        fontWeight: '800',
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
});
