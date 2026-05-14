import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS, SPACING } from '../../../shared/theme/tokens';
import type { Transaction } from '../types/transaction';
import {
    formatTransactionAmount,
    formatTransactionDate,
    formatTransactionType,
} from '../utils/transactionFormatters';

type TransactionRowProps = {
    transaction: Transaction;
    onPress: () => void;
};

export function TransactionRow({ transaction, onPress }: TransactionRowProps) {
    const amountStyle = transaction.type === 'credit' ? styles.creditAmount : styles.debitAmount;

    return (
        <Pressable style={styles.transactionRow} onPress={onPress}>
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
                {formatTransactionAmount(transaction)}
            </Text>
        </Pressable>
    );
}

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
});
