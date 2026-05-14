import type { PropsWithChildren } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { COLORS, SPACING } from '../theme/tokens';

type ScreenProps = PropsWithChildren<{
    includeTopInset?: boolean;
    style?: StyleProp<ViewStyle>;
}>;

export function Screen({ children, includeTopInset = true, style }: ScreenProps) {
    const edges: Edge[] = includeTopInset ? ['top', 'bottom'] : ['bottom'];

    return (
        <SafeAreaView edges={edges} style={[styles.container, style]}>
            {children}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: SPACING.space20,
        backgroundColor: COLORS.screenBackground,
    },
});
